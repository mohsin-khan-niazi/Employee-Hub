import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeaveDto } from './dtos/create-leave.dto';
import { UpdateLeaveDto } from './dtos/update-leave.dto';
import { Leaves, LeavesDocument } from './leave.schema';
import { LeaveCategory } from './leave.enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(Leaves.name)
    private LeaveModel: Model<LeavesDocument>,
    private usersService: UsersService,
  ) {}

  async createLeave(userId: string, createLeaveDto: CreateLeaveDto) {
    const { duration, category } = createLeaveDto;
    const { startDate, endDate } = duration;

    const numberOfDays = this.validateLeave(category, startDate, endDate);

    const leaveData = {
      ...createLeaveDto,
      numberOfDays,
      requestedBy: userId,
    };

    const savedLeave = await this.LeaveModel.create(leaveData);
    // TODO: Update leaves counts in the user
    this.usersService.updateLeavesCounts(userId, numberOfDays, category);
    return savedLeave;
  }

  validateLeave(category: string, startDate: Date, endDate: Date) {
    const calculateHoursDifference = (start: Date, end: Date): number => {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffHours = diffTime / (1000 * 60 * 60);
      return diffHours;
    };

    const calculateBusinessDays = (start: Date, end: Date): number => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      let businessDays = 0;
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return businessDays;
    };

    if (startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException('Start date must be before end date');
    }

    let numberOfDays = 0;
    const hoursDifference = calculateHoursDifference(startDate, endDate);

    if (category === LeaveCategory.FULL_DAY) {
      if (hoursDifference < 4) {
        throw new BadRequestException(
          'Time difference must be at least 4 hours for full-day leave',
        );
      }

      numberOfDays = calculateBusinessDays(startDate, endDate);
    } else if (category === LeaveCategory.HALF_DAY) {
      if (hoursDifference > 4 || hoursDifference < 2) {
        throw new BadRequestException(
          'Half-day leave cannot exceed 4 hours or less than 2 hours',
        );
      }

      numberOfDays = 0.5;
    } else if (category === LeaveCategory.QUARTER_DAY) {
      if (hoursDifference > 2) {
        throw new BadRequestException(
          'Quarter-day leave cannot exceed 2 hours',
        );
      }

      numberOfDays = 0.25;
    } else {
      throw new BadRequestException('Invalid category');
    }

    return numberOfDays;
  }

  async getLeaveById(id: string) {
    const leave = await this.findById(id);
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  async getUserLeaves(userId: string) {
    const leaves = await this.LeaveModel.find({ requestedBy: userId })
      .populate({
        path: 'requestedBy',
        select: 'personalInformation',
      })
      .populate({
        path: 'reviewedBy',
        select: 'personalInformation',
      });

    return leaves;
  }

  async updateLeaveStatus(
    id: string,
    updateLeaveDto: UpdateLeaveDto,
    reviewerId: string,
  ) {
    const leave = await this.getLeaveById(id);
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    const updatedLeave = await this.LeaveModel.findByIdAndUpdate(
      id,
      {
        status: updateLeaveDto.status,
        reviewedBy: reviewerId,
      },
      { new: true },
    )
      .populate({
        path: 'requestedBy',
        select: 'personalInformation',
      })
      .populate({
        path: 'reviewedBy',
        select: 'personalInformation',
      });

    return updatedLeave;
  }

  async getAllLeaves() {
    const leaves = await this.LeaveModel.find()
      .populate({
        path: 'requestedBy',
        select: 'personalInformation',
      })
      .populate({
        path: 'reviewedBy',
        select: 'personalInformation',
      });

    return leaves;
  }

  private async findById(id: string) {
    const leave = await this.LeaveModel.findById(id)
      .populate({
        path: 'requestedBy',
        select: 'personalInformation',
      })
      .populate({
        path: 'reviewedBy',
        select: 'personalInformation',
      });

    return leave;
  }
}
