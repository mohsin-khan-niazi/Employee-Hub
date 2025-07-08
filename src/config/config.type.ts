import { AppConfig } from './app-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { S3Config } from 'src/s3/config/s3-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  s3: S3Config;
  mail: MailConfig;
};
