import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { PersonalInformation } from './personal-information.schema';
import { EmploymentInformation } from 'src/users/domain/employment.information';
import { Leaves } from './leaves.schema';
import { BankingInformation } from './banking-information.schema';

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
    unique: true,
  })
  email?: string | null;

  @Prop({
    type: String,
  })
  password?: string;

  @Prop({
    type: PersonalInformation,
  })
  personalInformation: PersonalInformation;

  @Prop({
    type: EmploymentInformation,
  })
  employmentInformation?: EmploymentInformation;

  @Prop({
    type: Leaves,
  })
  leavesCount?: Leaves;

  @Prop({
    type: BankingInformation,
  })
  bankingInformation?: BankingInformation;

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
