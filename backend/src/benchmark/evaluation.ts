export type BenchmarkCategory = 'identical' | 'paraphrase' | 'unrelated';
export type MetricName = 'jaccard' | 'dice' | 'cosine' | 'semantic';

export interface BenchmarkCase {
  id: string;
  category: BenchmarkCategory;
  textA: string;
  textB: string;
}

export interface BenchmarkScore {
  id: string;
  category: BenchmarkCategory;
  metrics: Record<MetricName, number>;
}

export interface ClassificationMetrics {
  threshold: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
}

export const METRIC_NAMES: MetricName[] = [
  'jaccard',
  'dice',
  'cosine',
  'semantic',
];

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function summarizeByCategory(
  scores: BenchmarkScore[],
): Record<BenchmarkCategory, Record<MetricName, number>> {
  const categories: BenchmarkCategory[] = [
    'identical',
    'paraphrase',
    'unrelated',
  ];
  const summary = {} as Record<BenchmarkCategory, Record<MetricName, number>>;

  for (const category of categories) {
    const categoryScores = scores.filter(
      (score) => score.category === category,
    );
    summary[category] = Object.fromEntries(
      METRIC_NAMES.map((metric) => [
        metric,
        mean(categoryScores.map((score) => score.metrics[metric])),
      ]),
    ) as Record<MetricName, number>;
  }

  return summary;
}

/** Exploratory binary classification: identical/paraphrase are related, unrelated is negative. */
export function classifyAtThreshold(
  scores: BenchmarkScore[],
  metric: MetricName,
  threshold: number,
): ClassificationMetrics {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  for (const score of scores) {
    const expectedRelated = score.category !== 'unrelated';
    const predictedRelated = score.metrics[metric] >= threshold;

    if (expectedRelated && predictedRelated) truePositive++;
    else if (!expectedRelated && !predictedRelated) trueNegative++;
    else if (!expectedRelated && predictedRelated) falsePositive++;
    else falseNegative++;
  }

  const total = scores.length;
  const accuracy = total === 0 ? 0 : (truePositive + trueNegative) / total;
  const precision =
    truePositive + falsePositive === 0
      ? 0
      : truePositive / (truePositive + falsePositive);
  const recall =
    truePositive + falseNegative === 0
      ? 0
      : truePositive / (truePositive + falseNegative);
  const f1 =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall);

  return {
    threshold,
    accuracy,
    precision,
    recall,
    f1,
    truePositive,
    trueNegative,
    falsePositive,
    falseNegative,
  };
}
