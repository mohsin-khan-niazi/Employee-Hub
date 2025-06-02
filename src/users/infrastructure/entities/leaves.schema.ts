import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeavesDocument = HydratedDocument<Leaves>;

@Schema({ _id: false })
export class Leaves {
  @Prop({
    type: Number,
    default: 12,
  })
  casualLeaves?: number;

  @Prop({
    type: Number,
    default: 12,
  })
  sickLeaves?: number;

  @Prop({
    type: Number,
    default: 8,
  })
  emergencyLeaves?: number;

  @Prop({
    type: Number,
    default: 22,
  })
  workFromHome?: number;

  @Prop({
    type: Number,
    default: 12,
  })
  annualLeaves?: number;

  @Prop({
    type: Number,
    default: 60,
  })
  maternityLeaves?: number;
}

export const LeavesSchema = SchemaFactory.createForClass(Leaves);
