import * as stringSimilarity from 'string-similarity';

/** Coeficiente de Dice sobre bigramas de caracteres dos dois textos. */
export function diceSimilarity(textA: string, textB: string): number {
  return stringSimilarity.compareTwoStrings(textA, textB);
}
