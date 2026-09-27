import { diceSimilarity } from './dice-similarity';

describe('diceSimilarity', () => {
  it('returns 1 for identical strings', () => {
    expect(diceSimilarity('mesmo texto', 'mesmo texto')).toBe(1);
  });

  it('returns 0 for completely different strings', () => {
    expect(diceSimilarity('abc', 'xyz')).toBe(0);
  });

  it('returns a value between 0 and 1 for partially similar strings', () => {
    const score = diceSimilarity(
      'o gato subiu no telhado',
      'o gato desceu do telhado',
    );
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});
