import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HistoryEntryDto } from './dto/history-entry.dto';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOkResponse({ type: [HistoryEntryDto] })
  findAll(@Query('limit') limit?: string): HistoryEntryDto[] {
    const parsedLimit = Number(limit);
    return this.historyService.findAll(
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined,
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: HistoryEntryDto })
  findOne(@Param('id', ParseIntPipe) id: number): HistoryEntryDto {
    const entry = this.historyService.findOne(id);
    if (!entry) {
      throw new NotFoundException(
        `Registro de histórico ${id} não encontrado.`,
      );
    }
    return entry;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): void {
    const removed = this.historyService.remove(id);
    if (!removed) {
      throw new NotFoundException(
        `Registro de histórico ${id} não encontrado.`,
      );
    }
  }
}
