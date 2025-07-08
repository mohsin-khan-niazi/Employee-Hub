import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { S3Config } from './s3-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_KEY_ID: string;

  @IsString()
  SECRET_ACCESS_KEY: string;

  @IsString()
  S3_BUCKET_NAME: string;

  @IsString()
  S3_BUCKET_REGION: string;
}

export default registerAs<S3Config>('s3', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    bucketRegion: process.env.S3_BUCKET_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
