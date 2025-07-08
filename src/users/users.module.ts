import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { S3Module } from '../s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';

@Module({
  imports: [
    S3Module,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
