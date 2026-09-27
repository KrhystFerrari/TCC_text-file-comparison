import * as natural from 'natural';
import type { Tokenizer } from './tokenizer';

/** Isolado em módulo próprio para que o restante do domínio não dependa da lib `natural` diretamente. */
export function createNaturalTokenizer(): Tokenizer {
  return new natural.WordTokenizer();
}
