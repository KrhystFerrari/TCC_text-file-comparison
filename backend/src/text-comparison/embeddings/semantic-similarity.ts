export type SemanticSimilarityFn = (
  textA: string,
  textB: string,
) => Promise<number>;
