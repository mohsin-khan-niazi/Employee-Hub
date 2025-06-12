import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';
import { LeaveStatus, LeaveType } from '../../domain/leave.types';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type LeaveSchemaDocument = HydratedDocument<LeaveSchemaClass>;

@Schema({ timestamps: true })
export class LeaveSchemaClass extends EntityDocumentHelper {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  requestedBy: string;

  @Prop({
    type: String,
    enum: LeaveType,
    required: true,
  })
  type: LeaveType;

  @Prop({
    type: {
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      isSingleDay: { type: Boolean, default: true },
    },
    required: true,
  })
  duration: {
    startDate: Date;
    endDate?: Date;
    isSingleDay: boolean;
  };

  @Prop()
  numberOfDays: number;

  @Prop({
    type: String,
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  reviewedBy?: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const LeaveSchema = SchemaFactory.createForClass(LeaveSchemaClass);
