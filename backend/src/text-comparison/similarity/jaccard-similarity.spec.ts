import { jaccardSimilarity } from './jaccard-similarity';

describe('jaccardSimilarity', () => {
  it('returns 1 for two empty token lists', () => {
    expect(jaccardSimilarity([], [])).toBe(1);
  });

  it('returns 0 when there is no overlap', () => {
    expect(jaccardSimilarity(['a', 'b'], ['c', 'd'])).toBe(0);
  });

  it('returns 1 when token sets are identical', () => {
    expect(jaccardSimilarity(['a', 'b'], ['b', 'a'])).toBe(1);
  });

  it('computes intersection over union for partial overlap', () => {
    // intersection = {b, c} (2), union = {a, b, c, d} (4)
    expect(jaccardSimilarity(['a', 'b', 'c'], ['b', 'c', 'd'])).toBeCloseTo(
      2 / 4,
    );
  });

  it('ignores duplicate tokens (uses sets)', () => {
    expect(jaccardSimilarity(['a', 'a', 'b'], ['a', 'b', 'b'])).toBe(1);
  });
});
