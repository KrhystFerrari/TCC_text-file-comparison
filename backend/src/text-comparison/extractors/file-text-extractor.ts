import { BadRequestException } from '@nestjs/common';
import { extractDocxText } from './docx-extractor';
import { extractPdfText } from './pdf-extractor';
import { extractTxtText } from './txt-extractor';

const SUPPORTED_EXTENSIONS = ['txt', 'pdf', 'docx'] as const;

function getExtension(filename: string): string {
  const match = /\.([^./\\]+)$/.exec(filename);
  return match ? match[1].toLowerCase() : '';
}

/** Extrai o texto de um arquivo enviado, de acordo com sua extensão (.txt, .pdf ou .docx). */
export async function extractFileText(
  file: Express.Multer.File,
): Promise<string> {
  const extension = getExtension(file.originalname);

  switch (extension) {
    case 'txt':
      return extractTxtText(file.buffer);
    case 'pdf':
      return extractPdfText(file.buffer);
    case 'docx':
      return extractDocxText(file.buffer);
    default:
      throw new BadRequestException(
        `Formato de arquivo "${file.originalname}" não suportado. Use ${SUPPORTED_EXTENSIONS.map(
          (ext) => `.${ext}`,
        ).join(', ')}.`,
      );
  }
}
