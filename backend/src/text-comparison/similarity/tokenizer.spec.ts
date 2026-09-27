import { tokenize, normalizeText, type Tokenizer } from './tokenizer';

describe('normalizeText', () => {
  it('lowercases and strips accents', () => {
    expect(normalizeText('AÇÃO Café')).toBe('acao cafe');
  });
});

describe('tokenize', () => {
  const wordTokenizer: Tokenizer = {
    tokenize: (text: string) => text.split(/\s+/).filter(Boolean),
  };

  it('normalizes text before tokenizing', () => {
    expect(tokenize('Ação Café', wordTokenizer)).toEqual(['acao', 'cafe']);
  });

  it('filters out tokens without alphanumeric characters', () => {
    const punctuationTokenizer: Tokenizer = {
      tokenize: () => ['ola', '!!!', 'mundo', '...'],
    };
    expect(tokenize('qualquer coisa', punctuationTokenizer)).toEqual([
      'ola',
      'mundo',
    ]);
  });

  it('returns an empty array when the tokenizer yields null', () => {
    const nullTokenizer: Tokenizer = { tokenize: () => null };
    expect(tokenize('texto', nullTokenizer)).toEqual([]);
  });
});
