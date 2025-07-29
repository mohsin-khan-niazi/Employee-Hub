import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddLeavesCountsDto {
  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of casual leaves available',
  })
  @IsOptional()
  casualLeaves?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of sick leaves available',
  })
  @IsOptional()
  sickLeaves?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 8,
    description: 'Number of emergency leaves available',
  })
  @IsOptional()
  emergencyLeaves?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 22,
    description: 'Number of work-from-home days available',
  })
  @IsOptional()
  workFromHome?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of annual leaves available',
  })
  @IsOptional()
  annualLeaves?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 60,
    description: 'Number of maternity leaves available',
  })
  @IsOptional()
  maternityLeaves?: number;
}
