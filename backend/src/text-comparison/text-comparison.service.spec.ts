import { BadRequestException } from '@nestjs/common';
import type { SemanticSimilarityFn } from './embeddings';
import type { Tokenizer } from './similarity';
import { TextComparisonService } from './text-comparison.service';

const whitespaceTokenizer: Tokenizer = {
  tokenize: (text: string) => text.split(/\s+/).filter(Boolean),
};

/** Fake determinístico: 1 quando os textos são idênticos, 0 caso contrário. */
const fakeSemanticSimilarity: SemanticSimilarityFn = async (textA, textB) =>
  textA === textB ? 1 : 0;

describe('TextComparisonService', () => {
  let service: TextComparisonService;

  beforeEach(() => {
    service = new TextComparisonService(
      whitespaceTokenizer,
      fakeSemanticSimilarity,
    );
  });

  it('throws BadRequestException when the first source is empty', async () => {
    await expect(
      service.compare(
        { label: 'A', content: '   ' },
        { label: 'B', content: 'texto valido' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when the second source is empty', async () => {
    await expect(
      service.compare(
        { label: 'A', content: 'texto valido' },
        { label: 'B', content: '' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns correlationIndex 1 and matching stats for identical texts', async () => {
    const result = await service.compare(
      { label: 'A', content: 'o gato subiu no telhado' },
      { label: 'B', content: 'o gato subiu no telhado' },
    );

    expect(result.labelA).toBe('A');
    expect(result.labelB).toBe('B');
    expect(result.correlationIndex).toBe(1);
    expect(result.metrics).toEqual({
      jaccard: 1,
      dice: 1,
      cosine: 1,
      semantic: 1,
    });
    expect(result.stats).toEqual({
      wordCountA: 5,
      wordCountB: 5,
      uniqueWordsA: 5,
      uniqueWordsB: 5,
    });
    expect(result.diff?.wordsA.every((word) => word.matched)).toBe(true);
    expect(result.diff?.wordsB.every((word) => word.matched)).toBe(true);
  });

  it('returns a lower correlation index for completely different texts', async () => {
    const result = await service.compare(
      { label: 'A', content: 'abacaxi laranja manga' },
      { label: 'B', content: 'computador teclado tela' },
    );

    expect(result.correlationIndex).toBeLessThan(0.5);
    expect(result.metrics.jaccard).toBe(0);
    expect(result.metrics.semantic).toBe(0);
  });

  it('computes a partial correlation index for paraphrased texts', async () => {
    const result = await service.compare(
      { label: 'A', content: 'o gato subiu no telhado durante a noite' },
      { label: 'B', content: 'o gato desceu do telhado durante a manha' },
    );

    expect(result.correlationIndex).toBeGreaterThan(0);
    expect(result.correlationIndex).toBeLessThan(1);
  });

  it('clamps a negative semantic similarity to 0', async () => {
    const negativeSemanticService = new TextComparisonService(
      whitespaceTokenizer,
      async () => -0.3,
    );

    const result = await negativeSemanticService.compare(
      { label: 'A', content: 'texto a' },
      { label: 'B', content: 'texto b' },
    );

    expect(result.metrics.semantic).toBe(0);
  });
});
