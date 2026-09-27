import { vectorCosineSimilarity } from './vector-cosine-similarity';
import type { SemanticSimilarityFn } from './semantic-similarity';

/** Modelo multilíngue leve (suporta português), adequado para similaridade de frases. */
const MODEL_NAME = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

type Extractor = (
  text: string,
  options: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array | number[] }>;

/**
 * Isolado em módulo próprio: o modelo de embeddings é baixado e carregado sob
 * demanda (lazy) na primeira chamada, e reaproveitado nas chamadas seguintes.
 */
export function createXenovaSemanticSimilarity(): SemanticSimilarityFn {
  let extractorPromise: Promise<Extractor> | null = null;

  async function getExtractor(): Promise<Extractor> {
    if (!extractorPromise) {
      extractorPromise = import('@xenova/transformers').then(
        ({ pipeline }) =>
          pipeline('feature-extraction', MODEL_NAME) as unknown as Extractor,
      );
    }
    return extractorPromise;
  }

  return async function computeSemanticSimilarity(
    textA: string,
    textB: string,
  ): Promise<number> {
    const extractor = await getExtractor();
    const [embeddingA, embeddingB] = await Promise.all([
      embed(extractor, textA),
      embed(extractor, textB),
    ]);
    return vectorCosineSimilarity(embeddingA, embeddingB);
  };
}

async function embed(extractor: Extractor, text: string): Promise<number[]> {
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}
