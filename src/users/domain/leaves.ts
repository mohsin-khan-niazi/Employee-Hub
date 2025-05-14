import { ApiProperty } from '@nestjs/swagger';

export class Leaves {
  @ApiProperty({
    type: Number,
    example: 12,
  })
  casualLeaves?: number | null;

  @ApiProperty({
    type: Number,
    example: 12,
  })
  sickLeaves?: number | null;

  @ApiProperty({
    type: Number,
    example: 8,
  })
  emergencyLeaves?: number | null;

  @ApiProperty({
    type: Number,
    example: 22,
  })
  workFromHome?: number | null;

  @ApiProperty({
    type: Number,
    example: 12,
  })
  annualLeaves?: number | null;

  @ApiProperty({
    type: Number,
    example: 60,
  })
  maternityLeaves?: number | null;
}
