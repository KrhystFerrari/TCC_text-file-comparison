import { BadRequestException } from '@nestjs/common';

const extractTxtTextMock = jest.fn();
const extractPdfTextMock = jest.fn();
const extractDocxTextMock = jest.fn();

jest.mock('./txt-extractor', () => ({
  extractTxtText: (...args: unknown[]) => extractTxtTextMock(...args),
}));
jest.mock('./pdf-extractor', () => ({
  extractPdfText: (...args: unknown[]) => extractPdfTextMock(...args),
}));
jest.mock('./docx-extractor', () => ({
  extractDocxText: (...args: unknown[]) => extractDocxTextMock(...args),
}));

import { extractFileText } from './file-text-extractor';

function buildFile(originalname: string): Express.Multer.File {
  return {
    fieldname: 'fileA',
    originalname,
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    buffer: Buffer.from('conteudo'),
    size: 8,
    stream: undefined as never,
    destination: '',
    filename: '',
    path: '',
  };
}

describe('extractFileText', () => {
  beforeEach(() => {
    extractTxtTextMock.mockReset();
    extractPdfTextMock.mockReset();
    extractDocxTextMock.mockReset();
  });

  it('dispatches .txt files to extractTxtText', async () => {
    extractTxtTextMock.mockReturnValue('texto');

    const result = await extractFileText(buildFile('a.txt'));

    expect(result).toBe('texto');
    expect(extractTxtTextMock).toHaveBeenCalled();
  });

  it('dispatches .pdf files to extractPdfText', async () => {
    extractPdfTextMock.mockResolvedValue('texto do pdf');

    const result = await extractFileText(buildFile('a.PDF'));

    expect(result).toBe('texto do pdf');
    expect(extractPdfTextMock).toHaveBeenCalled();
  });

  it('dispatches .docx files to extractDocxText', async () => {
    extractDocxTextMock.mockResolvedValue('texto do docx');

    const result = await extractFileText(buildFile('a.docx'));

    expect(result).toBe('texto do docx');
    expect(extractDocxTextMock).toHaveBeenCalled();
  });

  it('throws BadRequestException for unsupported extensions', async () => {
    await expect(extractFileText(buildFile('a.doc'))).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadRequestException when the file has no extension', async () => {
    await expect(extractFileText(buildFile('arquivo'))).rejects.toThrow(
      BadRequestException,
    );
  });
});
