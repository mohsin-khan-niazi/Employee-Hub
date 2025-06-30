import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveCategory, LeaveType } from '../leave.enums';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveDurationDto {
  @ApiProperty({
    type: Date,
    example: '2024-03-20T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    type: Date,
    example: '2024-03-22T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}

export class CreateLeaveDto {
  @ApiProperty({
    type: String,
    example: 'Annual Leave Request',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    example: 'I need to take leave for personal reasons',
  })
  @IsString()
  description: string;

  @ApiProperty({
    enum: LeaveType,
    example: LeaveType.ANNUAL,
  })
  @IsEnum(LeaveType)
  type: string;

  @ApiProperty({
    type: String,
    enum: LeaveCategory,
    default: LeaveCategory.FULL_DAY,
  })
  @IsEnum(LeaveCategory)
  category: string;

  @ApiProperty({
    type: LeaveDurationDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => LeaveDurationDto)
  @IsNotEmpty()
  duration: LeaveDurationDto;
}
