import { ApiProperty } from '@nestjs/swagger';

export class MetricsDto {
  @ApiProperty({
    description:
      'Similaridade de Jaccard sobre o conjunto de palavras únicas de cada texto.',
    minimum: 0,
    maximum: 1,
  })
  jaccard: number;

  @ApiProperty({
    description:
      'Coeficiente de Dice sobre bigramas de caracteres (via string-similarity).',
    minimum: 0,
    maximum: 1,
  })
  dice: number;

  @ApiProperty({
    description:
      'Similaridade de cosseno sobre vetores de frequência de termos (TF).',
    minimum: 0,
    maximum: 1,
  })
  cosine: number;

  @ApiProperty({
    description:
      'Similaridade semântica via embeddings (modelo multilíngue de sentence-transformers), captura significado além da sobreposição léxica.',
    minimum: 0,
    maximum: 1,
  })
  semantic: number;
}

export class StatsDto {
  @ApiProperty()
  wordCountA: number;

  @ApiProperty()
  wordCountB: number;

  @ApiProperty()
  uniqueWordsA: number;

  @ApiProperty()
  uniqueWordsB: number;
}

class DiffWordDto {
  @ApiProperty()
  text: string;

  @ApiProperty({
    description: 'true quando a palavra também aparece no outro texto.',
  })
  matched: boolean;
}

class WordDiffDto {
  @ApiProperty({ type: [DiffWordDto] })
  wordsA: DiffWordDto[];

  @ApiProperty({ type: [DiffWordDto] })
  wordsB: DiffWordDto[];
}

export class CompareTextsResultDto {
  /** Nome do arquivo enviado, ou "Texto colado" quando a entrada foi digitada/colada. */
  @ApiProperty({ example: 'texto-a.txt' })
  labelA: string;

  @ApiProperty({ example: 'Texto colado' })
  labelB: string;

  /** Índice de correlação final (0 a 1), calculado como média das métricas abaixo. */
  @ApiProperty({ minimum: 0, maximum: 1, example: 0.7342 })
  correlationIndex: number;

  @ApiProperty({ type: MetricsDto })
  metrics: MetricsDto;

  @ApiProperty({ type: StatsDto })
  stats: StatsDto;

  /**
   * Diff palavra a palavra (LCS) entre os dois textos, usado para destacar
   * trechos iguais/diferentes na UI. `null` quando os textos são grandes
   * demais para o diff (ver `MAX_DIFF_TOKENS`).
   */
  @ApiProperty({ type: WordDiffDto, nullable: true })
  diff: WordDiffDto | null;
}
