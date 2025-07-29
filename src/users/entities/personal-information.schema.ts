import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type PersonalInformationDocument = HydratedDocument<PersonalInformation>;

@Schema({ _id: false })
export class PersonalInformation {
  @Prop({
    type: String,
  })
  fullName: string;

  @Prop({
    type: String,
  })
  fatherName: string;

  @Prop({
    type: String,
  })
  nationality: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
  })
  birthDate: string;

  @Prop({
    type: String,
  })
  gender: string;

  @Prop({
    type: String,
  })
  phoneNo: string;

  @Prop({
    type: String,
  })
  nationalId: string;

  @Prop({
    type: String,
  })
  photo: string;
}
export const PersonalInformationSchema =
  SchemaFactory.createForClass(PersonalInformation);
