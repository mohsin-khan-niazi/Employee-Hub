import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { FilesModule } from '../files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/entities/user.schema';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
