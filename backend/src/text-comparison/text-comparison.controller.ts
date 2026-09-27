import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HistoryService } from '../history/history.service';
import {
  CompareManyResultDto,
  RankedComparisonDto,
} from './dto/compare-many-result.dto';
import { CompareTextsResultDto } from './dto/compare-texts-result.dto';
import { resolveTextSource } from './resolve-text-source';
import { TextComparisonService } from './text-comparison.service';

type UploadedFilesDict = {
  fileA?: Express.Multer.File[];
  fileB?: Express.Multer.File[];
};

interface CompareTextsBody {
  textA?: string;
  textB?: string;
}

type CompareManyFilesDict = {
  sourceFile?: Express.Multer.File[];
  candidateFiles?: Express.Multer.File[];
};

interface CompareManyBody {
  sourceText?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_CANDIDATES = 20;

@ApiTags('text-comparison')
@Controller('text-comparison')
export class TextComparisonController {
  private readonly logger = new Logger(TextComparisonController.name);

  constructor(
    private readonly textComparisonService: TextComparisonService,
    private readonly historyService: HistoryService,
  ) {}

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Compara dois textos e calcula o índice de correlação',
    description:
      'Para cada lado (A e B), envie um arquivo (.txt, .pdf ou .docx) OU um texto colado. Pelo menos uma das duas opções é obrigatória por lado.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileA: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo do texto A (.txt, .pdf, .docx)',
        },
        fileB: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo do texto B (.txt, .pdf, .docx)',
        },
        textA: { type: 'string', description: 'Texto A colado diretamente' },
        textB: { type: 'string', description: 'Texto B colado diretamente' },
      },
    },
  })
  @ApiOkResponse({ type: CompareTextsResultDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fileA', maxCount: 1 },
        { name: 'fileB', maxCount: 1 },
      ],
      { limits: { fileSize: MAX_FILE_SIZE_BYTES } },
    ),
  )
  async compare(
    @UploadedFiles() files: UploadedFilesDict,
    @Body() body: CompareTextsBody,
  ): Promise<CompareTextsResultDto> {
    const sourceA = await resolveTextSource(files.fileA?.[0], body.textA, 'A');
    const sourceB = await resolveTextSource(files.fileB?.[0], body.textB, 'B');

    const result = await this.textComparisonService.compare(sourceA, sourceB);
    this.saveToHistory(result);

    return result;
  }

  @Post('compare-many')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Compara um texto de origem contra vários candidatos, retornando um ranking por similaridade',
    description:
      'Estilo "detector de plágio": envie um texto de origem (arquivo ou colado) e uma lista de arquivos candidatos. O resultado traz cada comparação, ordenada da mais para a menos similar.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceFile: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de origem (.txt, .pdf, .docx)',
        },
        sourceText: {
          type: 'string',
          description: 'Texto de origem colado diretamente',
        },
        candidateFiles: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'Arquivos candidatos a serem comparados com a origem (.txt, .pdf, .docx)',
        },
      },
    },
  })
  @ApiOkResponse({ type: CompareManyResultDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sourceFile', maxCount: 1 },
        { name: 'candidateFiles', maxCount: MAX_CANDIDATES },
      ],
      { limits: { fileSize: MAX_FILE_SIZE_BYTES } },
    ),
  )
  async compareMany(
    @UploadedFiles() files: CompareManyFilesDict,
    @Body() body: CompareManyBody,
  ): Promise<CompareManyResultDto> {
    const source = await resolveTextSource(
      files.sourceFile?.[0],
      body.sourceText,
      'origem',
    );

    const candidateFiles = files.candidateFiles ?? [];
    if (candidateFiles.length === 0) {
      throw new BadRequestException(
        'Envie ao menos um arquivo candidato para comparar com a origem.',
      );
    }

    const results: RankedComparisonDto[] = [];
    for (const candidateFile of candidateFiles) {
      const candidate = await resolveTextSource(
        candidateFile,
        undefined,
        'candidato',
      );
      const result = await this.textComparisonService.compare(
        source,
        candidate,
      );
      this.saveToHistory(result);
      results.push({ ...result, rank: 0 });
    }

    results.sort((a, b) => b.correlationIndex - a.correlationIndex);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    return { sourceLabel: source.label, results };
  }

  private saveToHistory(result: CompareTextsResultDto): void {
    try {
      this.historyService.record(result);
    } catch (error) {
      this.logger.warn(
        `Falha ao salvar comparação no histórico: ${(error as Error).message}`,
      );
    }
  }
}
