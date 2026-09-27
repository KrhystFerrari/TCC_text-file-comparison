import { cosineSimilarity } from './cosine-similarity';

describe('cosineSimilarity', () => {
  it('returns 0 when both token lists are empty', () => {
    expect(cosineSimilarity([], [])).toBe(0);
  });

  it('returns 0 when there is no shared vocabulary', () => {
    expect(cosineSimilarity(['a', 'b'], ['c', 'd'])).toBe(0);
  });

  it('returns 1 for identical frequency vectors', () => {
    expect(cosineSimilarity(['a', 'b', 'a'], ['a', 'b', 'a'])).toBeCloseTo(1);
  });

  it('computes partial similarity for overlapping vocabularies', () => {
    // A: {a:2, b:1} | B: {a:1, c:1} -> dot = 2*1 = 2
    // |A| = sqrt(4+1) = sqrt(5) | |B| = sqrt(1+1) = sqrt(2)
    const expected = 2 / (Math.sqrt(5) * Math.sqrt(2));
    expect(cosineSimilarity(['a', 'a', 'b'], ['a', 'c'])).toBeCloseTo(expected);
  });
});
