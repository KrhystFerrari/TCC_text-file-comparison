function buildFrequencyMap(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const token of tokens) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }
  return map;
}

/**
 * Similaridade de cosseno sobre vetores de frequência de termos (bag-of-words)
 * dos dois textos.
 */
export function cosineSimilarity(tokensA: string[], tokensB: string[]): number {
  const frequencyA = buildFrequencyMap(tokensA);
  const frequencyB = buildFrequencyMap(tokensB);
  const vocabulary = new Set([...frequencyA.keys(), ...frequencyB.keys()]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const term of vocabulary) {
    const freqA = frequencyA.get(term) ?? 0;
    const freqB = frequencyB.get(term) ?? 0;
    dotProduct += freqA * freqB;
    magnitudeA += freqA ** 2;
    magnitudeB += freqB ** 2;
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
