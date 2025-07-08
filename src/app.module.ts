import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import s3Config from './s3/config/s3.config';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';
import { LeavesModule } from './leaves/leaves.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, s3Config],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    HomeModule,
    AuthModule,
    UsersModule,
    LeavesModule,
    S3Module,
    MailModule,
  ],
})
export class AppModule {}
