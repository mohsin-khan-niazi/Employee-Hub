import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AddPersonalInformationDto {
  @ApiProperty({ example: 'Jane', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsOptional()
  fatherName?: string | null;

  @ApiProperty({ example: 'Korean', type: String })
  @IsOptional()
  nationality?: string | null;

  @ApiProperty({ example: '1234567890', type: String })
  @IsOptional()
  nationalId?: string | null;

  @ApiProperty({ example: '1234567890', type: String })
  @IsOptional()
  address?: string | null;

  @ApiProperty({ example: '1990-01-01', type: String })
  @IsOptional()
  birthDate?: string | null;

  @ApiProperty({ example: 'Male', type: String })
  @IsOptional()
  gender?: string | null;

  @ApiProperty({ example: '090078601', type: String })
  @IsOptional()
  phoneNo?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;
}
export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  role?: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  status?: string | null;

  @ApiPropertyOptional({ type: AddPersonalInformationDto })
  @IsOptional()
  personalInformation?: AddPersonalInformationDto | null;
}
