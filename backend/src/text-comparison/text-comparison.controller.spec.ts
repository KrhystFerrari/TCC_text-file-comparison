import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from '../history/history.service';
import { TextComparisonController } from './text-comparison.controller';
import {
  TextComparisonService,
  type TextSource,
} from './text-comparison.service';

function buildMulterFile(
  overrides: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  return {
    fieldname: 'fileA',
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

describe('TextComparisonController', () => {
  let controller: TextComparisonController;
  let compareMock: jest.Mock;
  let recordMock: jest.Mock;

  beforeEach(async () => {
    compareMock = jest.fn().mockReturnValue({ correlationIndex: 1 });
    recordMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextComparisonController],
      providers: [
        { provide: TextComparisonService, useValue: { compare: compareMock } },
        { provide: HistoryService, useValue: { record: recordMock } },
      ],
    }).compile();

    controller = module.get(TextComparisonController);
  });

  it('resolves both sides from uploaded files', async () => {
    const fileA = buildMulterFile({ originalname: 'a.txt' });
    const fileB = buildMulterFile({ originalname: 'b.txt' });

    await controller.compare({ fileA: [fileA], fileB: [fileB] }, {});

    const [sourceA, sourceB]: TextSource[] = compareMock.mock.calls[0];
    expect(sourceA).toEqual({ label: 'a.txt', content: 'conteudo do arquivo' });
    expect(sourceB).toEqual({ label: 'b.txt', content: 'conteudo do arquivo' });
  });

  it('resolves both sides from pasted text when no files are sent', async () => {
    await controller.compare({}, { textA: 'texto A', textB: 'texto B' });

    const [sourceA, sourceB]: TextSource[] = compareMock.mock.calls[0];
    expect(sourceA).toEqual({ label: 'Texto colado', content: 'texto A' });
    expect(sourceB).toEqual({ label: 'Texto colado', content: 'texto B' });
  });

  it('prefers the uploaded file over pasted text for the same side', async () => {
    const fileA = buildMulterFile({ originalname: 'a.txt' });

    await controller.compare(
      { fileA: [fileA] },
      { textA: 'ignorado', textB: 'texto B' },
    );

    const [sourceA]: TextSource[] = compareMock.mock.calls[0];
    expect(sourceA.label).toBe('a.txt');
  });

  it('throws BadRequestException when a side has neither file nor text', async () => {
    await expect(controller.compare({}, { textB: 'texto B' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadRequestException when pasted text is blank', async () => {
    await expect(
      controller.compare({}, { textA: '   ', textB: 'texto B' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException for an unsupported file extension', async () => {
    const fileA = buildMulterFile({ originalname: 'a.exe' });

    await expect(
      controller.compare({ fileA: [fileA] }, { textB: 'texto B' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('records the comparison result in history', async () => {
    const result = await controller.compare(
      {},
      { textA: 'texto A', textB: 'texto B' },
    );

    expect(recordMock).toHaveBeenCalledWith(result);
  });

  it('still returns the result when saving to history fails', async () => {
    recordMock.mockImplementation(() => {
      throw new Error('disco cheio');
    });

    const result = await controller.compare(
      {},
      { textA: 'texto A', textB: 'texto B' },
    );

    expect(result).toEqual({ correlationIndex: 1 });
  });

  describe('compareMany', () => {
    it('ranks candidates from most to least similar and records each in history', async () => {
      compareMock.mockImplementation(
        (_source: unknown, candidate: { label: string }) => ({
          labelA: 'origem.txt',
          labelB: candidate.label,
          correlationIndex:
            candidate.label === 'baixo.txt'
              ? 0.2
              : candidate.label === 'alto.txt'
                ? 0.9
                : 0.5,
        }),
      );

      const candidateFiles = [
        buildMulterFile({ originalname: 'baixo.txt' }),
        buildMulterFile({ originalname: 'alto.txt' }),
        buildMulterFile({ originalname: 'medio.txt' }),
      ];

      const response = await controller.compareMany(
        {
          sourceFile: [buildMulterFile({ originalname: 'origem.txt' })],
          candidateFiles,
        },
        {},
      );

      expect(response.sourceLabel).toBe('origem.txt');
      expect(response.results.map((r) => [r.labelB, r.rank])).toEqual([
        ['alto.txt', 1],
        ['medio.txt', 2],
        ['baixo.txt', 3],
      ]);
      expect(recordMock).toHaveBeenCalledTimes(3);
    });

    it('throws BadRequestException when no candidate files are sent', async () => {
      await expect(
        controller.compareMany({ sourceFile: [buildMulterFile()] }, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when the source is missing', async () => {
      await expect(
        controller.compareMany(
          { candidateFiles: [buildMulterFile({ originalname: 'a.txt' })] },
          {},
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('accepts a pasted source text instead of a file', async () => {
      compareMock.mockReturnValue({
        labelA: 'Texto colado',
        labelB: 'a.txt',
        correlationIndex: 0.4,
      });

      const response = await controller.compareMany(
        { candidateFiles: [buildMulterFile({ originalname: 'a.txt' })] },
        { sourceText: 'texto de origem' },
      );

      expect(response.sourceLabel).toBe('Texto colado');
    });
  });
});
