import { ApiProperty } from '@nestjs/swagger';
import { FileType } from 'src/files/domain/file';

export class PersonalInformation {
  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName?: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName?: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  fullName?: string;

  @ApiProperty({
    type: String,
  })
  fatherName?: string | null;

  @ApiProperty({
    type: String,
  })
  nationality?: string | null;

  @ApiProperty({
    type: String,
  })
  address?: string | null;

  @ApiProperty({
    type: String,
  })
  birthDate?: string | null;

  @ApiProperty({
    type: String,
    enum: ['male', 'female', 'other'],
  })
  gender?: string | null;

  @ApiProperty({
    type: String,
  })
  phoneNo?: string | null;

  @ApiProperty({
    type: String,
  })
  nationalId?: string | null;

  @ApiProperty({
    type: FileType,
  })
  photo?: FileType | null;
}
