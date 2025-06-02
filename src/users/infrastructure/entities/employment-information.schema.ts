import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmploymentInformationDocument = EmploymentInformation & Document;

@Schema({ timestamps: true })
export class EmploymentInformation {
  @Prop(
    raw({
      pkr: { type: Number },
      aed: { type: Number },
      exchangeRate: { type: Number },
    }),
  )
  salary?: {
    pkr: number | null;
    aed: number | null;
    exchangeRate: number | null;
  };

  @Prop({ type: Date })
  joiningDate?: Date | null;

  @Prop({ type: String })
  designation?: string | null;

  @Prop({ type: String })
  department?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reportsTo?: Types.ObjectId | null;

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'permanent', 'on-contract', 'terminated'],
  })
  status?: string | null;

  @Prop({ type: String, enum: ['admin', 'user'] })
  role?: string | null;

  @Prop(
    raw({
      start: { type: String },
      end: { type: String },
    }),
  )
  shiftHours?: {
    start?: string | null;
    end?: string | null;
  };
}

export const EmploymentInformationSchema = SchemaFactory.createForClass(
  EmploymentInformation,
);
