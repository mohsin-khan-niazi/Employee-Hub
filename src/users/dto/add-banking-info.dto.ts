import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddBankingInformationDto {
  @ApiProperty({ example: 'HBL', type: String })
  @IsOptional()
  bankName?: string;

  @ApiProperty({ example: 'Jane Doe', type: String })
  @IsOptional()
  accountTitle?: string;

  @ApiProperty({ example: 'PK42HABB1234567890123', type: String })
  @IsOptional()
  accountNumber?: string;
}
