import { ApiProperty } from '@nestjs/swagger';
import {
  MetricsDto,
  StatsDto,
} from '../../text-comparison/dto/compare-texts-result.dto';

export class HistoryEntryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  labelA: string;

  @ApiProperty()
  labelB: string;

  @ApiProperty({ minimum: 0, maximum: 1 })
  correlationIndex: number;

  @ApiProperty({ type: MetricsDto })
  metrics: MetricsDto;

  @ApiProperty({ type: StatsDto })
  stats: StatsDto;

  @ApiProperty({ description: 'Data/hora da comparação, em ISO 8601.' })
  createdAt: string;
}
