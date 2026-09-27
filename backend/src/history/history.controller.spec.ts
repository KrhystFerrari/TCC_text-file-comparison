import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

describe('HistoryController', () => {
  let controller: HistoryController;
  let findAllMock: jest.Mock;
  let findOneMock: jest.Mock;
  let removeMock: jest.Mock;

  beforeEach(async () => {
    findAllMock = jest.fn().mockReturnValue([]);
    findOneMock = jest.fn();
    removeMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: {
            findAll: findAllMock,
            findOne: findOneMock,
            remove: removeMock,
          },
        },
      ],
    }).compile();

    controller = module.get(HistoryController);
  });

  it('lists entries with the default limit when none is provided', () => {
    controller.findAll(undefined);

    expect(findAllMock).toHaveBeenCalledWith(undefined);
  });

  it('parses a valid limit query param', () => {
    controller.findAll('5');

    expect(findAllMock).toHaveBeenCalledWith(5);
  });

  it('ignores an invalid limit query param', () => {
    controller.findAll('not-a-number');

    expect(findAllMock).toHaveBeenCalledWith(undefined);
  });

  it('returns a single entry when found', () => {
    findOneMock.mockReturnValue({ id: 1, labelA: 'a.txt' });

    expect(controller.findOne(1)).toEqual({ id: 1, labelA: 'a.txt' });
  });

  it('throws NotFoundException when the entry does not exist', () => {
    findOneMock.mockReturnValue(null);

    expect(() => controller.findOne(999)).toThrow(NotFoundException);
  });

  it('removes an existing entry without error', () => {
    removeMock.mockReturnValue(true);

    expect(() => controller.remove(1)).not.toThrow();
  });

  it('throws NotFoundException when removing a non-existent entry', () => {
    removeMock.mockReturnValue(false);

    expect(() => controller.remove(999)).toThrow(NotFoundException);
  });
});
