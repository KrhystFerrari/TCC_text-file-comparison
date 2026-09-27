/** Extração trivial: arquivos .txt já são texto puro. */
export function extractTxtText(buffer: Buffer): string {
  return buffer.toString('utf-8');
}
