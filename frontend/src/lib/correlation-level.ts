export type CorrelationLevel = 'low' | 'medium' | 'high'

/** Classifica o índice de correlação (0 a 1) em uma faixa qualitativa. */
export function getCorrelationLevel(
  correlationIndex: number,
): CorrelationLevel {
  if (correlationIndex >= 0.7) return 'high'
  if (correlationIndex >= 0.4) return 'medium'
  return 'low'
}
