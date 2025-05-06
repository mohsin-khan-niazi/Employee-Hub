import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  first_name: string | null;

  @Prop({
    type: String,
  })
  last_name: string | null;

  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Prop({
    type: String,
  })
  father_name: string | null;

  @Prop({
    type: String,
    unique: true,
  })
  email: string | null;

  @Prop()
  password?: string;

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
  birth_date: string;

  @Prop({
    type: String,
  })
  gender: string;

  @Prop({
    type: String,
  })
  phone_no: string;

  @Prop({
    type: String,
  })
  national_id: string;

  @Prop({
    type: FileSchemaClass,
  })
  photo?: FileSchemaClass | null;

  @Prop({
    type: String,
  })
  role?: string | null;

  @Prop({
    type: String,
  })
  status?: string | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
