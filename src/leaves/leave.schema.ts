import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LeaveCategory, LeaveStatus, LeaveType } from './leave.enums';

export type LeavesDocument = Document<Leaves>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class Leaves {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  requestedBy: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  reviewedBy?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: LeaveType,
    required: true,
  })
  type: LeaveType;

  @Prop({
    type: String,
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: string;

  @Prop({
    type: String,
    enum: LeaveCategory,
    default: LeaveCategory.FULL_DAY,
  })
  category: string;

  @Prop()
  numberOfDays: number;

  @Prop({
    type: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    required: true,
    _id: false,
  })
  duration: {
    startDate: Date;
    endDate?: Date;
  };
}

export const LeaveSchema = SchemaFactory.createForClass(Leaves);
