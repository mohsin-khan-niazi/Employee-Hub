import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmploymentInformationDocument = EmploymentInformation & Document;

@Schema({ _id: false })
export class EmploymentInformation {
  @Prop(
    raw({
      pkr: { type: Number },
      aed: { type: Number },
      exchangeRate: { type: Number },
    }),
  )
  salary: {
    pkr: number;
    aed: number;
    exchangeRate: number;
  };

  @Prop({ type: Date })
  joiningDate: Date;

  @Prop({ type: String })
  designation: string;

  @Prop({ type: String })
  department: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reportsTo: string;

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'permanent', 'on-contract', 'terminated'],
  })
  status: string;

  @Prop({ type: String, enum: ['admin', 'user'] })
  role: string;

  @Prop(
    raw({
      start: { type: String },
      end: { type: String },
    }),
  )
  shiftHours?: {
    start: string;
    end: string;
  };
}

export const EmploymentInformationSchema = SchemaFactory.createForClass(
  EmploymentInformation,
);
