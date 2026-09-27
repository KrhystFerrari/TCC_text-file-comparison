import { PDFParse } from 'pdf-parse';

/** Extrai o texto puro de um PDF, isolado em módulo próprio para facilitar mocks em teste. */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}
