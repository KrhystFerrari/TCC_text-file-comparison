/**
 * Similaridade de cosseno entre dois vetores densos (embeddings), diferente
 * de `cosineSimilarity` (bag-of-words) usada para a métrica léxica.
 */
export function vectorCosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] ** 2;
    magnitudeB += b[i] ** 2;
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
