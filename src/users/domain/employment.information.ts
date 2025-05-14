import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class EmploymentInformation {
  @ApiProperty({
    type: Object,
    example: {
      pkr: 50000,
      aed: 1000,
      exchangeRate: 80.5,
    },
  })
  salary?: {
    pkr: number | null;
    aed: number | null;
    exchangeRate: number | null;
  };

  @ApiProperty({
    type: Date,
  })
  joiningDate?: Date | null;

  @ApiProperty({
    type: String,
    example: 'Software Engineer',
  })
  designation?: string | null;

  @ApiProperty({
    type: String,
    example: 'Engineering',
  })
  department?: string | null;

  @ApiProperty({
    type: String,
    example: '60d5f484f1c2b8a3d4e4e4e4',
  })
  reportsTo?: Types.ObjectId | null;

  @ApiProperty({
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    example: 'active',
  })
  status?: string | null;

  @ApiProperty({
    type: String,
    enum: ['admin', 'user'],
    example: 'user',
  })
  role?: string | null;

  @ApiProperty({
    type: Object,
    example: {
      start: '09:00',
      end: '17:00',
    },
  })
  shiftHours?: {
    start?: string | null;
    end?: string | null;
  };
}
