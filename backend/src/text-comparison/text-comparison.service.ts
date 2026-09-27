import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SEMANTIC_SIMILARITY, TOKENIZER } from './text-comparison.constants';
import { CompareTextsResultDto } from './dto/compare-texts-result.dto';
import { computeWordDiff } from './diff';
import type { SemanticSimilarityFn } from './embeddings';
import {
  cosineSimilarity,
  diceSimilarity,
  jaccardSimilarity,
  roundScore,
  tokenize,
  type Tokenizer,
} from './similarity';

export interface TextSource {
  /** Nome do arquivo original, ou "Texto colado" quando digitado/colado diretamente. */
  label: string;
  content: string;
}

@Injectable()
export class TextComparisonService {
  constructor(
    @Inject(TOKENIZER) private readonly tokenizer: Tokenizer,
    @Inject(SEMANTIC_SIMILARITY)
    private readonly computeSemanticSimilarity: SemanticSimilarityFn,
  ) {}

  async compare(
    sourceA: TextSource,
    sourceB: TextSource,
  ): Promise<CompareTextsResultDto> {
    const textA = this.assertNonEmpty(sourceA);
    const textB = this.assertNonEmpty(sourceB);

    const tokensA = tokenize(textA, this.tokenizer);
    const tokensB = tokenize(textB, this.tokenizer);

    const jaccard = jaccardSimilarity(tokensA, tokensB);
    const dice = diceSimilarity(textA, textB);
    const cosine = cosineSimilarity(tokensA, tokensB);
    // O cosseno entre embeddings pode ser levemente negativo; para a UI, tratamos como "sem relação" (0).
    const semantic = Math.max(
      0,
      await this.computeSemanticSimilarity(textA, textB),
    );

    const correlationIndex = (jaccard + dice + cosine + semantic) / 4;

    return {
      labelA: sourceA.label,
      labelB: sourceB.label,
      correlationIndex: roundScore(correlationIndex),
      metrics: {
        jaccard: roundScore(jaccard),
        dice: roundScore(dice),
        cosine: roundScore(cosine),
        semantic: roundScore(semantic),
      },
      stats: {
        wordCountA: tokensA.length,
        wordCountB: tokensB.length,
        uniqueWordsA: new Set(tokensA).size,
        uniqueWordsB: new Set(tokensB).size,
      },
      diff: computeWordDiff(textA, textB),
    };
  }

  private assertNonEmpty(source: TextSource): string {
    if (!source?.content?.trim()) {
      throw new BadRequestException(
        `"${source?.label ?? 'Texto'}" está vazio ou não foi enviado.`,
      );
    }
    return source.content;
  }
}
