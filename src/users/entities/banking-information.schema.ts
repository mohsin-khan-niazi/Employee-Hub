import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BankingInformationDocument = HydratedDocument<BankingInformation>;

@Schema({ _id: false })
export class BankingInformation {
  @Prop({
    type: String,
  })
  bankName: string;

  @Prop({
    type: String,
  })
  accountTitle: string;

  @Prop({
    type: String,
  })
  accountNumber: string;
}

export const BankingInformationSchema =
  SchemaFactory.createForClass(BankingInformation);
