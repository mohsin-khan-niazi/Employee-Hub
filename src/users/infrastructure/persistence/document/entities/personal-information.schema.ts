import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type PersonalInformationDocument = HydratedDocument<PersonalInformation>;

@Schema({
  _id: false,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class PersonalInformation extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  first_name?: string | null;

  @Prop({
    type: String,
  })
  last_name?: string | null;

  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Prop({
    type: String,
  })
  father_name?: string | null;

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
  birth_date?: string | null;

  @Prop({
    type: String,
  })
  gender?: string | null;

  @Prop({
    type: String,
  })
  phone_no?: string | null;

  @Prop({
    type: String,
  })
  national_id?: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  photo?: FileSchemaClass | null;
}

export const PersonalInformationSchema =
  SchemaFactory.createForClass(PersonalInformation);
