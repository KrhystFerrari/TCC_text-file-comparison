import * as mammoth from 'mammoth';

/** Extrai o texto puro de um .docx, isolado em módulo próprio para facilitar mocks em teste. */
export async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
