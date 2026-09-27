export interface DiffWord {
  text: string;
  /** true quando a palavra também aparece (na mesma posição relativa) no outro texto. */
  matched: boolean;
}

export interface WordDiffResult {
  wordsA: DiffWord[];
  wordsB: DiffWord[];
}

/** Acima deste número de tokens em qualquer um dos textos, o diff (O(n·m)) é pulado por custo computacional. */
export const MAX_DIFF_TOKENS = 4000;

/**
 * Diff clássico por palavra via LCS (Longest Common Subsequence), comparado
 * de forma case-insensitive mas preservando a grafia original na saída.
 */
export function computeWordDiff(
  textA: string,
  textB: string,
): WordDiffResult | null {
  const tokensA = splitWords(textA);
  const tokensB = splitWords(textB);

  if (tokensA.length > MAX_DIFF_TOKENS || tokensB.length > MAX_DIFF_TOKENS) {
    return null;
  }

  const normalizedA = tokensA.map((token) => token.toLowerCase());
  const normalizedB = tokensB.map((token) => token.toLowerCase());

  const lcsTable = buildLcsTable(normalizedA, normalizedB);
  const { matchedA, matchedB } = backtrackMatches(
    lcsTable,
    normalizedA,
    normalizedB,
  );

  return {
    wordsA: tokensA.map((text, index) => ({ text, matched: matchedA[index] })),
    wordsB: tokensB.map((text, index) => ({ text, matched: matchedB[index] })),
  };
}

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter((word) => word.length > 0);
}

function buildLcsTable(a: string[], b: string[]): number[][] {
  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      table[i][j] =
        a[i - 1] === b[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }

  return table;
}

function backtrackMatches(
  table: number[][],
  a: string[],
  b: string[],
): { matchedA: boolean[]; matchedB: boolean[] } {
  const matchedA = new Array<boolean>(a.length).fill(false);
  const matchedB = new Array<boolean>(b.length).fill(false);

  let i = a.length;
  let j = b.length;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      matchedA[i - 1] = true;
      matchedB[j - 1] = true;
      i--;
      j--;
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { matchedA, matchedB };
}
