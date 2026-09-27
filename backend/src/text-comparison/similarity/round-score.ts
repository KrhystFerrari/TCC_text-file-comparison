/** Arredonda para 4 casas decimais (percentuais com 2 casas na UI). */
export function roundScore(value: number): number {
  return Math.round(value * 10000) / 10000;
}
