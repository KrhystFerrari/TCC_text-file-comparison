const DIACRITICS_REGEX = /[\u0300-\u036f]/g;
const ALPHANUMERIC_REGEX = /[a-z0-9]/;

/** Minúsculas e sem acentos, para comparação tolerante a variações de escrita. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(DIACRITICS_REGEX, '');
}

export function tokenize(text: string, tokenizer: Tokenizer): string[] {
  const normalized = normalizeText(text);
  return (tokenizer.tokenize(normalized) ?? []).filter((token) =>
    ALPHANUMERIC_REGEX.test(token),
  );
}

export interface Tokenizer {
  tokenize(text: string): string[] | null;
}
