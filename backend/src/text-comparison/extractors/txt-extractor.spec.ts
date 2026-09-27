import { extractTxtText } from './txt-extractor';

describe('extractTxtText', () => {
  it('decodes a buffer as UTF-8 text', () => {
    expect(extractTxtText(Buffer.from('olá mundo', 'utf-8'))).toBe('olá mundo');
  });
});
