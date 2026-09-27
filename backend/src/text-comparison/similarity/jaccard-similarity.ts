/**
 * Similaridade de Jaccard: razão entre a interseção e a união dos conjuntos
 * de tokens únicos de cada texto.
 */
export function jaccardSimilarity(
  tokensA: string[],
  tokensB: string[],
): number {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  if (setA.size === 0 && setB.size === 0) return 1;

  const intersectionSize = [...setA].filter((token) => setB.has(token)).length;
  const unionSize = new Set([...setA, ...setB]).size;

  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}
