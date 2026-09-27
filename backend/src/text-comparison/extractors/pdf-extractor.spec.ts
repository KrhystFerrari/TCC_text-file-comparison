const getTextMock = jest.fn();
const destroyMock = jest.fn();

jest.mock('pdf-parse', () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getText: getTextMock,
    destroy: destroyMock,
  })),
}));

import { extractPdfText } from './pdf-extractor';

describe('extractPdfText', () => {
  beforeEach(() => {
    getTextMock.mockReset();
    destroyMock.mockReset();
  });

  it('returns the concatenated text extracted from the PDF', async () => {
    getTextMock.mockResolvedValue({ text: 'conteúdo do pdf' });
    destroyMock.mockResolvedValue(undefined);

    const result = await extractPdfText(Buffer.from('fake-pdf'));

    expect(result).toBe('conteúdo do pdf');
    expect(destroyMock).toHaveBeenCalledTimes(1);
  });

  it('destroys the parser even when extraction fails', async () => {
    getTextMock.mockRejectedValue(new Error('arquivo corrompido'));
    destroyMock.mockResolvedValue(undefined);

    await expect(extractPdfText(Buffer.from('fake-pdf'))).rejects.toThrow(
      'arquivo corrompido',
    );
    expect(destroyMock).toHaveBeenCalledTimes(1);
  });
});
