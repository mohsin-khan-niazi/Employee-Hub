import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddPersonalInformationDto {
  @ApiProperty({ example: 'Jane Doe', type: String })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsOptional()
  fatherName: string;

  @ApiProperty({ example: 'Korean', type: String })
  @IsOptional()
  nationality: string;

  @ApiProperty({ example: '1234567890', type: String })
  @IsOptional()
  nationalId: string;

  @ApiProperty({ example: '123 Street, City, Country', type: String })
  @IsOptional()
  address: string;

  @ApiProperty({ example: '1990-01-01', type: String })
  @IsOptional()
  birthDate: string;

  @ApiProperty({ example: 'Male', type: String })
  @IsOptional()
  gender: string;

  @ApiProperty({ example: '090078601', type: String })
  @IsOptional()
  phoneNo: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', type: String })
  @IsOptional()
  photo: string;
}
