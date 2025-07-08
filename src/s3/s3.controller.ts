import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Body,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('S3 Module')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('health')
  async checkHealth() {
    return this.s3Service.checkHealth();
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.s3Service.create(file);
  }

  @Put('')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        old_image_url: {
          type: 'string',
        },
      },
    },
  })
  async update(
    @UploadedFile() newImage: Express.Multer.File,
    @Body('old_image_url') oldImageUrl: string,
  ) {
    return this.s3Service.update(newImage, oldImageUrl);
  }

  @Delete('/:image')
  async remove(@Param('image') oldImageUrl: string) {
    return this.s3Service.remove(oldImageUrl);
  }
}
