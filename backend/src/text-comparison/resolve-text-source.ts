import { BadRequestException } from '@nestjs/common';
import { extractFileText } from './extractors';
import type { TextSource } from './text-comparison.service';

const PASTED_TEXT_LABEL = 'Texto colado';

/** Resolve um `TextSource` a partir de um arquivo enviado OU de um texto colado, para um lado nomeado. */
export async function resolveTextSource(
  file: Express.Multer.File | undefined,
  pastedText: string | undefined,
  side: string,
): Promise<TextSource> {
  if (file?.buffer?.length) {
    const content = await extractFileText(file);
    return { label: file.originalname, content };
  }
  if (pastedText?.trim()) {
    return { label: PASTED_TEXT_LABEL, content: pastedText };
  }
  throw new BadRequestException(
    `Envie um arquivo ou cole um texto para o item ${side}.`,
  );
}
