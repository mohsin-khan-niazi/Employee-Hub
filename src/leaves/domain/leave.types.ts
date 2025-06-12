import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PersonalInformation } from 'src/users/domain/personal-information';

export enum LeaveType {
  CASUAL = 'casual',
  SICK = 'sick',
  EMERGENCY = 'emergency',
  ANNUAL = 'annual',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  WFH = 'work-from-home',
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

export class UserReference {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Object,
  })
  personalInformation: PersonalInformation;
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
    oneOf: [
      { type: 'string' },
      { type: 'object', $ref: getSchemaPath(UserReference) },
    ],
  })
  requestedBy: string | UserReference;

  @ApiProperty({
    type: String,
    enum: LeaveType,
  })
  type: LeaveType;

  @ApiProperty({
    type: LeaveDuration,
  })
  @Type(() => LeaveDuration)
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
    oneOf: [
      { type: 'string' },
      { type: 'object', $ref: getSchemaPath(UserReference) },
    ],
  })
  reviewedBy?: string | UserReference;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
