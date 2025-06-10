import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { LeaveRepository } from './infrastructure/leave.repository';
import { LeaveSchema } from './infrastructure/entities/leave.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Leave', schema: LeaveSchema }]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService, LeaveRepository],
  exports: [LeaveService],
})
export class LeavesModule {}
