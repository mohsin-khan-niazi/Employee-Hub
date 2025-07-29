import { ApiProperty } from '@nestjs/swagger';

export class AddEmploymentInformationDto {
  @ApiProperty({
    type: Object,
    example: {
      pkr: 50000,
      aed: 1000,
      exchangeRate: 80.5,
    },
  })
  salary?: {
    pkr: number;
    aed: number;
    exchangeRate: number;
  };

  @ApiProperty({
    type: Date,
  })
  joiningDate?: Date;

  @ApiProperty({
    type: String,
    example: 'Software Engineer',
  })
  designation?: string;

  @ApiProperty({
    type: String,
    example: 'Engineering',
  })
  department?: string;

  @ApiProperty({
    type: String,
    example: '60d5f484f1c2b8a3d4e4e4e4',
  })
  reportsTo?: string;

  @ApiProperty({
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    example: 'active',
  })
  status?: string;

  @ApiProperty({
    type: String,
    enum: ['admin', 'user'],
    example: 'user',
  })
  role?: string;

  @ApiProperty({
    type: Object,
    example: {
      start: '09:00',
      end: '17:00',
    },
  })
  shiftHours?: {
    start: string;
    end: string;
  };
}
