const extractRawTextMock = jest.fn();

jest.mock('mammoth', () => ({
  extractRawText: (...args: unknown[]) => extractRawTextMock(...args),
}));

import { extractDocxText } from './docx-extractor';

describe('extractDocxText', () => {
  beforeEach(() => {
    extractRawTextMock.mockReset();
  });

  it('returns the raw text extracted from the docx buffer', async () => {
    extractRawTextMock.mockResolvedValue({ value: 'conteúdo do docx' });

    const buffer = Buffer.from('fake-docx');
    const result = await extractDocxText(buffer);

    expect(result).toBe('conteúdo do docx');
    expect(extractRawTextMock).toHaveBeenCalledWith({ buffer });
  });
});
