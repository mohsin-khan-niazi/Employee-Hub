import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { AddBankingInformationDto } from './add-banking-info.dto';
import { AddEmploymentInformationDto } from './add-employment-info.dto';
import { AddLeavesCountsDto } from './add-leave-counts.dto';
import { AddPersonalInformationDto } from './add-personal-info.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ type: AddPersonalInformationDto })
  @IsOptional()
  personalInformation?: AddPersonalInformationDto;

  @ApiPropertyOptional({ type: AddEmploymentInformationDto })
  @IsOptional()
  employmentInformation?: AddEmploymentInformationDto;

  @ApiPropertyOptional({ type: AddLeavesCountsDto })
  @IsOptional()
  leavesCounts?: AddLeavesCountsDto;

  @ApiPropertyOptional({ type: AddBankingInformationDto })
  @IsOptional()
  bankingInformation?: AddBankingInformationDto;
}
