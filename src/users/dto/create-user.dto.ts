import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
// import { FileDto } from '../../files/dto/file.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { Types } from 'mongoose';

export class AddEmploymentInformationDto {
  @ApiProperty({
    type: Object,
    example: {
      pkr: 50000,
      aed: 1000,
      exchangeRate: 80.5,
    },
  })
  salary?: {
    pkr: number | null;
    aed: number | null;
    exchangeRate: number | null;
  };

  @ApiProperty({
    type: Date,
  })
  joiningDate?: Date | null;

  @ApiProperty({
    type: String,
    example: 'Software Engineer',
  })
  designation?: string | null;

  @ApiProperty({
    type: String,
    example: 'Engineering',
  })
  department?: string | null;

  @ApiProperty({
    type: Types.ObjectId,
    example: '60d5f484f1c2b8a3d4e4e4e4',
  })
  reportsTo?: Types.ObjectId | null;

  @ApiProperty({
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    example: 'active',
  })
  status?: string | null;

  @ApiProperty({
    type: String,
    enum: ['admin', 'user'],
    example: 'user',
  })
  role?: string | null;

  @ApiProperty({
    type: Object,
    example: {
      start: '09:00',
      end: '17:00',
    },
  })
  shiftHours?: {
    start?: string | null;
    end?: string | null;
  };
}
export class AddPersonalInformationDto {
  @ApiProperty({ example: 'Jane Doe', type: String })
  @IsNotEmpty()
  fullName?: string | null;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsOptional()
  fatherName?: string | null;

  @ApiProperty({ example: 'Korean', type: String })
  @IsOptional()
  nationality?: string | null;

  @ApiProperty({ example: '1234567890', type: String })
  @IsOptional()
  nationalId?: string | null;

  @ApiProperty({ example: '123 Street, City, Country', type: String })
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

  // @ApiPropertyOptional({ type: () => FileDto })
  // @IsOptional()
  // photo?: FileDto | null;
}

export class AddLeavesCountsDto {
  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of casual leaves available',
  })
  @IsOptional()
  casualLeaves?: number | null;

  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of sick leaves available',
  })
  @IsOptional()
  sickLeaves?: number | null;

  @ApiPropertyOptional({
    type: Number,
    example: 8,
    description: 'Number of emergency leaves available',
  })
  @IsOptional()
  emergencyLeaves?: number | null;

  @ApiPropertyOptional({
    type: Number,
    example: 22,
    description: 'Number of work-from-home days available',
  })
  @IsOptional()
  workFromHome?: number | null;

  @ApiPropertyOptional({
    type: Number,
    example: 12,
    description: 'Number of annual leaves available',
  })
  @IsOptional()
  annualLeaves?: number | null;

  @ApiPropertyOptional({
    type: Number,
    example: 60,
    description: 'Number of maternity leaves available',
  })
  @IsOptional()
  maternityLeaves?: number | null;
}

export class AddBankingInformationDto {
  @ApiProperty({ example: 'HBL', type: String })
  @IsOptional()
  bankName?: string | null;

  @ApiProperty({ example: 'Jane Doe', type: String })
  @IsOptional()
  accountTitle?: string | null;

  @ApiProperty({ example: 'PK42HABB1234567890123', type: String })
  @IsOptional()
  accountNumber?: string | null;
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

  // @ApiPropertyOptional({ type: String })
  // @IsOptional()
  // role?: string | null;

  // @ApiPropertyOptional({ type: String })
  // @IsOptional()
  // status?: string | null;

  @ApiPropertyOptional({ type: AddPersonalInformationDto })
  @IsOptional()
  personalInformation?: AddPersonalInformationDto | null;

  @ApiPropertyOptional({ type: AddEmploymentInformationDto })
  @IsOptional()
  employmentInformation?: AddEmploymentInformationDto | null;

  @ApiPropertyOptional({ type: AddLeavesCountsDto })
  @IsOptional()
  leavesCounts?: AddLeavesCountsDto | null;

  @ApiPropertyOptional({ type: AddBankingInformationDto })
  @IsOptional()
  bankingInformation?: AddBankingInformationDto | null;
}
