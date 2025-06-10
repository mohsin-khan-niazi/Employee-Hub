import { ApiProperty } from '@nestjs/swagger';

export enum LeaveType {
  CASUAL = 'casual',
  SICK = 'sick',
  EMERGENCY = 'emergency',
  ANNUAL = 'annual',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  WFH = 'wfh',
  ASSET_REQUEST = 'asset-request',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class LeaveDuration {
  @ApiProperty({
    type: Date,
  })
  startDate: Date;
  @ApiProperty({
    type: Date,
  })
  endDate?: Date;

  @ApiProperty({
    type: Boolean,
  })
  isSingleDay: boolean;
}

export class Leave {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  requestedBy: string;

  @ApiProperty({
    type: String,
    enum: LeaveType,
  })
  type: LeaveType;

  @ApiProperty({
    type: LeaveDuration,
  })
  duration: LeaveDuration;

  @ApiProperty({
    type: Number,
  })
  numberOfDays: number;

  @ApiProperty({
    type: String,
    enum: LeaveStatus,
  })
  status: LeaveStatus;

  @ApiProperty({
    type: String,
  })
  reviewedBy?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
