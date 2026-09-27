import * as fs from 'node:fs';
import * as path from 'node:path';
import { createXenovaSemanticSimilarity } from '../src/text-comparison/embeddings/xenova-semantic-similarity';
import { createNaturalTokenizer } from '../src/text-comparison/similarity/natural-tokenizer';
import { TextComparisonService } from '../src/text-comparison/text-comparison.service';
import {
  classifyAtThreshold,
  summarizeByCategory,
  type BenchmarkCase,
  type BenchmarkScore,
  type MetricName,
} from '../src/benchmark/evaluation';

const THRESHOLD = 0.5;
const datasetPath = path.join(__dirname, '../benchmark/benchmark-dataset.json');
const resultJsonPath = path.join(__dirname, '../benchmark/results.json');
const resultCsvPath = path.join(__dirname, '../benchmark/results.csv');

async function main(): Promise<void> {
  const cases = JSON.parse(
    fs.readFileSync(datasetPath, 'utf8'),
  ) as BenchmarkCase[];
  const comparisonService = new TextComparisonService(
    createNaturalTokenizer(),
    createXenovaSemanticSimilarity(),
  );
  const scores: BenchmarkScore[] = [];

  for (const benchmarkCase of cases) {
    const result = await comparisonService.compare(
      { label: `${benchmarkCase.id}-A`, content: benchmarkCase.textA },
      { label: `${benchmarkCase.id}-B`, content: benchmarkCase.textB },
    );
    scores.push({
      id: benchmarkCase.id,
      category: benchmarkCase.category,
      metrics: result.metrics,
    });
    console.log(
      `${benchmarkCase.id.padEnd(16)} ${benchmarkCase.category.padEnd(10)} ` +
        `J=${result.metrics.jaccard.toFixed(3)} D=${result.metrics.dice.toFixed(3)} ` +
        `C=${result.metrics.cosine.toFixed(3)} S=${result.metrics.semantic.toFixed(3)}`,
    );
  }

  const summary = summarizeByCategory(scores);
  const classification = Object.fromEntries(
    (['jaccard', 'dice', 'cosine', 'semantic'] as MetricName[]).map(
      (metric) => [metric, classifyAtThreshold(scores, metric, THRESHOLD)],
    ),
  );
  const report = {
    generatedAt: new Date().toISOString(),
    dataset: path.basename(datasetPath),
    sampleCount: scores.length,
    categoryCounts: {
      identical: scores.filter((score) => score.category === 'identical')
        .length,
      paraphrase: scores.filter((score) => score.category === 'paraphrase')
        .length,
      unrelated: scores.filter((score) => score.category === 'unrelated')
        .length,
    },
    exploratoryClassificationThreshold: THRESHOLD,
    meanScoresByCategory: summary,
    binaryClassification: classification,
    scores,
  };

  fs.writeFileSync(
    resultJsonPath,
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );
  fs.writeFileSync(resultCsvPath, toCsv(scores), 'utf8');
  console.log(`\nJSON: ${resultJsonPath}`);
  console.log(`CSV:  ${resultCsvPath}`);
}

function toCsv(scores: BenchmarkScore[]): string {
  const header = 'id,category,jaccard,dice,cosine,semantic';
  const rows = scores.map(({ id, category, metrics }) =>
    [
      id,
      category,
      metrics.jaccard,
      metrics.dice,
      metrics.cosine,
      metrics.semantic,
    ].join(','),
  );
  return `${[header, ...rows].join('\n')}\n`;
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
