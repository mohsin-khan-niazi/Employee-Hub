import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PersonalInformation } from './personal-information';
import { EmploymentInformation } from './employment.information';
import { Leaves } from './leaves';
import { BankingInformation } from './banking-information';

export class User {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email?: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiProperty({
    type: PersonalInformation,
  })
  personalInformation: PersonalInformation;

  @ApiProperty({
    type: EmploymentInformation,
  })
  employmentInformation: EmploymentInformation;

  @ApiProperty({
    type: Leaves,
  })
  leavesCounts: Leaves;

  @ApiProperty({
    type: BankingInformation,
  })
  bankingInformation?: BankingInformation;

  @ApiProperty({
    type: String,
  })
  role?: string | null;

  @ApiProperty({
    type: String,
  })
  status?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
