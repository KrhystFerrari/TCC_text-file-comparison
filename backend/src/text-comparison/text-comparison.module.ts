import { Module } from '@nestjs/common';
import { HistoryModule } from '../history/history.module';
import { createXenovaSemanticSimilarity } from './embeddings';
import { createNaturalTokenizer } from './similarity/natural-tokenizer';
import { TextComparisonController } from './text-comparison.controller';
import { SEMANTIC_SIMILARITY, TOKENIZER } from './text-comparison.constants';
import { TextComparisonService } from './text-comparison.service';

@Module({
  imports: [HistoryModule],
  controllers: [TextComparisonController],
  providers: [
    TextComparisonService,
    { provide: TOKENIZER, useFactory: createNaturalTokenizer },
    {
      provide: SEMANTIC_SIMILARITY,
      useFactory: createXenovaSemanticSimilarity,
    },
  ],
})
export class TextComparisonModule {}
