import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EntityDocumentHelper } from '../../utils/document-entity-helper';
import { PersonalInformation } from './personal-information.schema';
import { EmploymentInformation } from './employment-information.schema';
import { LeaveCounts } from './leave-counts.schema';
import { BankingInformation } from './banking-information.schema';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: PersonalInformation,
  })
  personalInformation: PersonalInformation;

  @Prop({
    type: EmploymentInformation,
  })
  employmentInformation: EmploymentInformation;

  @Prop({
    type: LeaveCounts,
  })
  leavesCount: LeaveCounts;

  @Prop({
    type: BankingInformation,
  })
  bankingInformation: BankingInformation;

  @Prop({
    type: String,
  })
  role: string;

  @Prop({
    type: String,
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
