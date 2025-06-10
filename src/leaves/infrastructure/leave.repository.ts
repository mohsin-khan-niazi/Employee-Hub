import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveSchemaClass } from './entities/leave.schema';
import { Leave, LeaveStatus } from '../domain/leave.types';
import { LeaveMapper } from './mappers/leave.mapper';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class LeaveRepository {
  constructor(
    @InjectModel('Leave')
    private leaveModel: Model<LeaveSchemaClass>,
  ) {}

  async create(data: Leave): Promise<Leave> {
    const persistenceLeave = LeaveMapper.toPersistence(data);
    const createdLeave = new this.leaveModel(persistenceLeave);
    const savedLeave = await createdLeave.save();
    return LeaveMapper.toDomain(savedLeave);
  }

  async findById(id: Leave['id']): Promise<NullableType<Leave>> {
    const leave = await this.leaveModel.findById(id).exec();
    return leave ? LeaveMapper.toDomain(leave) : null;
  }

  async findByUserId(userId: Leave['requestedBy']): Promise<Leave[]> {
    const leaves = await this.leaveModel.find({ requestedBy: userId }).exec();
    return LeaveMapper.toDomainList(leaves);
  }

  async updateStatus(
    id: Leave['id'],
    status: LeaveStatus,
    reviewedBy: Leave['reviewedBy'],
  ): Promise<NullableType<Leave>> {
    const leave = await this.leaveModel
      .findByIdAndUpdate(id, { status, reviewedBy }, { new: true })
      .exec();
    return leave ? LeaveMapper.toDomain(leave) : null;
  }

  async findAll(): Promise<Leave[]> {
    const leaves = await this.leaveModel.find().exec();
    return LeaveMapper.toDomainList(leaves);
  }
}
