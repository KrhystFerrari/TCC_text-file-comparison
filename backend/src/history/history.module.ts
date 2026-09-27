import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, databaseProvider],
  exports: [HistoryService],
})
export class HistoryModule {}
