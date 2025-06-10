import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType } from '../domain/leave.types';
import { ApiProperty } from '@nestjs/swagger';

export class LeaveDurationDto {
  @ApiProperty({
    type: Date,
    example: '2024-03-20T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    type: Date,
    example: '2024-03-22T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  isSingleDay?: boolean;
}

export class CreateLeaveDto {
  @ApiProperty({
    type: String,
    example: 'Annual Leave Request',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    example: 'I need to take leave for personal reasons',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: LeaveType,
    example: LeaveType.ANNUAL,
  })
  @IsEnum(LeaveType)
  type: LeaveType;

  @ApiProperty({
    type: LeaveDurationDto,
  })
  @ValidateNested()
  @Type(() => LeaveDurationDto)
  duration: LeaveDurationDto;

  @ApiProperty({
    type: Number,
    example: 3,
  })
  @IsNumber()
  numberOfDays: number;
}
