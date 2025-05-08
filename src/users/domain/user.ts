import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PersonalInformation } from './personal-information';

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
