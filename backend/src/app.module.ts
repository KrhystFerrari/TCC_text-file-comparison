import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HistoryModule } from './history/history.module';
import { TextComparisonModule } from './text-comparison/text-comparison.module';

@Module({
  imports: [TextComparisonModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
