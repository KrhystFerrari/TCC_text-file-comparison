import { vectorCosineSimilarity } from './vector-cosine-similarity';

describe('vectorCosineSimilarity', () => {
  it('returns 0 for empty vectors', () => {
    expect(vectorCosineSimilarity([], [])).toBe(0);
  });

  it('returns 0 for vectors of different lengths', () => {
    expect(vectorCosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });

  it('returns 1 for identical vectors', () => {
    expect(vectorCosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(vectorCosineSimilarity([1, 0], [0, 1])).toBe(0);
  });

  it('returns 0 when either vector is all zeros', () => {
    expect(vectorCosineSimilarity([0, 0], [1, 2])).toBe(0);
  });

  it('computes the expected value for a partial match', () => {
    // dot = 1*1 + 0*1 = 1 | |a| = 1 | |b| = sqrt(2)
    expect(vectorCosineSimilarity([1, 0], [1, 1])).toBeCloseTo(
      1 / Math.sqrt(2),
    );
  });
});
