import {
  classifyAtThreshold,
  mean,
  summarizeByCategory,
  type BenchmarkScore,
} from './evaluation';

const scores: BenchmarkScore[] = [
  {
    id: 'exact',
    category: 'identical',
    metrics: { jaccard: 1, dice: 1, cosine: 1, semantic: 1 },
  },
  {
    id: 'paraphrase',
    category: 'paraphrase',
    metrics: { jaccard: 0.2, dice: 0.5, cosine: 0.4, semantic: 0.8 },
  },
  {
    id: 'unrelated',
    category: 'unrelated',
    metrics: { jaccard: 0, dice: 0.1, cosine: 0, semantic: 0.1 },
  },
];

describe('benchmark evaluation helpers', () => {
  it('returns zero for an empty mean and averages values otherwise', () => {
    expect(mean([])).toBe(0);
    expect(mean([0.2, 0.4, 0.6])).toBeCloseTo(0.4);
  });

  it('summarizes mean metric scores by category', () => {
    const summary = summarizeByCategory(scores);

    expect(summary.identical.semantic).toBe(1);
    expect(summary.paraphrase.semantic).toBe(0.8);
    expect(summary.unrelated.semantic).toBe(0.1);
  });

  it('computes confusion-matrix metrics at a fixed threshold', () => {
    const result = classifyAtThreshold(scores, 'semantic', 0.5);

    expect(result).toEqual({
      threshold: 0.5,
      accuracy: 1,
      precision: 1,
      recall: 1,
      f1: 1,
      truePositive: 2,
      trueNegative: 1,
      falsePositive: 0,
      falseNegative: 0,
    });
  });

  it('returns zero metrics when classifying an empty score set', () => {
    expect(classifyAtThreshold([], 'jaccard', 0.5)).toEqual({
      threshold: 0.5,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1: 0,
      truePositive: 0,
      trueNegative: 0,
      falsePositive: 0,
      falseNegative: 0,
    });
  });
});
