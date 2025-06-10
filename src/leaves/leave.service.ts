import { Injectable, NotFoundException } from '@nestjs/common';
import { LeaveRepository } from './infrastructure/leave.repository';
import { CreateLeaveDto } from './dtos/create-leave.dto';
import { UpdateLeaveDto } from './dtos/update-leave.dto';
import { Leave, LeaveStatus } from './domain/leave.types';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class LeaveService {
  constructor(private readonly leaveRepository: LeaveRepository) {}

  async createLeave(
    createLeaveDto: CreateLeaveDto,
    userId: string,
  ): Promise<Leave> {
    const leave = {
      ...createLeaveDto,
      requestedBy: userId,
      status: LeaveStatus.PENDING,
    };
    return this.leaveRepository.create(leave as Leave);
  }

  async getLeaveById(id: string): Promise<Leave> {
    const leave = await this.leaveRepository.findById(id);
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  async getUserLeaves(userId: string): Promise<Leave[]> {
    return this.leaveRepository.findByUserId(userId);
  }

  async updateLeaveStatus(
    id: string,
    updateLeaveDto: UpdateLeaveDto,
    reviewerId: string,
  ): Promise<NullableType<Leave>> {
    const leave = await this.getLeaveById(id);
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    return this.leaveRepository.updateStatus(
      id,
      updateLeaveDto.status as LeaveStatus,
      reviewerId,
    );
  }

  async getAllLeaves(): Promise<Leave[]> {
    return this.leaveRepository.findAll();
  }
}
