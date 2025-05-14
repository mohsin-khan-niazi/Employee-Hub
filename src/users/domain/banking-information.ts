import { ApiProperty } from '@nestjs/swagger';

export class BankingInformation {
  @ApiProperty({
    type: String,
    example: 'HBL',
  })
  bankName?: string | null;

  @ApiProperty({
    type: String,
    example: 'Jane Doe',
  })
  accountTitle?: string | null;

  @ApiProperty({
    type: String,
    example: 'PK42HABB1234567890123',
  })
  accountNumber?: string | null;
}
