import { IsEnum, IsOptional } from 'class-validator';
import { LeaveStatus } from '../domain/leave.types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeaveDto {
  @ApiProperty({
    enum: LeaveStatus,
    example: LeaveStatus.APPROVED,
  })
  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;
}
