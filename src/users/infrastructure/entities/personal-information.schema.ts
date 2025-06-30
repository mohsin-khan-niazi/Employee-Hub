import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// import { FileSchemaClass } from '../../../files/infrastructure/persistence/document/entities/file.schema';

export type PersonalInformationDocument = HydratedDocument<PersonalInformation>;

@Schema({ _id: false })
export class PersonalInformation {
  @Prop({
    type: String,
  })
  fullName?: string | null;

  @Prop({
    type: String,
  })
  fatherName?: string | null;

  @Prop({
    type: String,
  })
  nationality?: string | null;

  @Prop({
    type: String,
  })
  address?: string | null;

  @Prop({
    type: String,
  })
  birthDate?: string | null;

  @Prop({
    type: String,
  })
  gender?: string | null;

  @Prop({
    type: String,
  })
  phoneNo?: string | null;

  @Prop({
    type: String,
  })
  nationalId?: string | null;

  // TODO: Revisit this
  // @Prop({
  //   type: FileSchemaClass,
  // })
  // photo?: FileSchemaClass | null;
}
export const PersonalInformationSchema =
  SchemaFactory.createForClass(PersonalInformation);
