import { computeWordDiff, MAX_DIFF_TOKENS } from './word-diff';

describe('computeWordDiff', () => {
  it('marks every word as matched for identical texts', () => {
    const result = computeWordDiff(
      'o gato subiu no telhado',
      'o gato subiu no telhado',
    );

    expect(result?.wordsA.every((word) => word.matched)).toBe(true);
    expect(result?.wordsB.every((word) => word.matched)).toBe(true);
  });

  it('marks every word as unmatched for completely different texts', () => {
    const result = computeWordDiff(
      'abacaxi laranja manga',
      'computador teclado tela',
    );

    expect(result?.wordsA.every((word) => !word.matched)).toBe(true);
    expect(result?.wordsB.every((word) => !word.matched)).toBe(true);
  });

  it('is case-insensitive when matching words', () => {
    const result = computeWordDiff('Ola Mundo', 'ola mundo');

    expect(result?.wordsA.every((word) => word.matched)).toBe(true);
    expect(result?.wordsB.every((word) => word.matched)).toBe(true);
  });

  it('preserves original casing/spelling in the output', () => {
    const result = computeWordDiff('Ola Mundo', 'ola mundo');

    expect(result?.wordsA.map((word) => word.text)).toEqual(['Ola', 'Mundo']);
  });

  it('highlights only the differing words for partially similar texts', () => {
    const result = computeWordDiff(
      'o gato subiu no telhado',
      'o gato desceu do telhado',
    );

    expect(result?.wordsA.map((w) => `${w.text}:${w.matched}`)).toEqual([
      'o:true',
      'gato:true',
      'subiu:false',
      'no:false',
      'telhado:true',
    ]);
    expect(result?.wordsB.map((w) => `${w.text}:${w.matched}`)).toEqual([
      'o:true',
      'gato:true',
      'desceu:false',
      'do:false',
      'telhado:true',
    ]);
  });

  it('returns null when either text exceeds the token limit', () => {
    const hugeText = new Array(MAX_DIFF_TOKENS + 1).fill('palavra').join(' ');

    expect(computeWordDiff(hugeText, 'texto pequeno')).toBeNull();
    expect(computeWordDiff('texto pequeno', hugeText)).toBeNull();
  });
});
