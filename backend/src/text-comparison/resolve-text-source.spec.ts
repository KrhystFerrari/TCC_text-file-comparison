import { BadRequestException } from '@nestjs/common';
import { resolveTextSource } from './resolve-text-source';

function buildFile(
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'texto.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    buffer: Buffer.from('conteudo do arquivo'),
    size: 20,
    stream: undefined as never,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  };
}

describe('resolveTextSource', () => {
  it('resolves from an uploaded file, extracting its text', async () => {
    const file = buildFile({ originalname: 'a.txt' });

    const source = await resolveTextSource(file, undefined, 'A');

    expect(source).toEqual({ label: 'a.txt', content: 'conteudo do arquivo' });
  });

  it('resolves from pasted text when no file is sent', async () => {
    const source = await resolveTextSource(undefined, 'texto colado', 'A');

    expect(source).toEqual({ label: 'Texto colado', content: 'texto colado' });
  });

  it('prefers the uploaded file over pasted text', async () => {
    const file = buildFile({ originalname: 'a.txt' });

    const source = await resolveTextSource(file, 'ignorado', 'A');

    expect(source.label).toBe('a.txt');
  });

  it('throws BadRequestException when neither a file nor text is provided', async () => {
    await expect(resolveTextSource(undefined, undefined, 'A')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadRequestException when pasted text is blank', async () => {
    await expect(resolveTextSource(undefined, '   ', 'A')).rejects.toThrow(
      BadRequestException,
    );
  });
});
