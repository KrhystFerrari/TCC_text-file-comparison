/** Conta palavras separadas por espaço em branco, ignorando strings vazias. */
export function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length
}
