import { ApiProperty } from '@nestjs/swagger';
import { CompareTextsResultDto } from './compare-texts-result.dto';

export class RankedComparisonDto extends CompareTextsResultDto {
  @ApiProperty({
    description: 'Posição no ranking (1 = mais similar ao texto de origem).',
  })
  rank: number;
}

export class CompareManyResultDto {
  @ApiProperty({
    description: 'Rótulo do texto de origem (o texto sendo verificado).',
  })
  sourceLabel: string;

  @ApiProperty({ type: [RankedComparisonDto] })
  results: RankedComparisonDto[];
}
