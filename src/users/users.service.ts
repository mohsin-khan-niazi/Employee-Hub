import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import bcrypt from 'bcryptjs';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaClass } from './infrastructure/entities/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly UserModel: Model<UserSchemaClass>,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.findByEmail(createUserDto.email);
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      email = createUserDto.email;
    }

    let photo: FileType | null | undefined = undefined;

    if (createUserDto.personalInformation?.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.personalInformation?.photo?.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (createUserDto.personalInformation?.photo === null) {
      photo = null;
    }

    let role: string | undefined = undefined;

    if (createUserDto.employmentInformation?.role) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.employmentInformation?.role));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = createUserDto.employmentInformation?.role;
    }

    let status: string | undefined = undefined;

    if (createUserDto.employmentInformation?.status) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.employmentInformation?.status));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = createUserDto.employmentInformation?.status;
    }

    const userData = {
      personalInformation: {
        fullName: createUserDto.personalInformation?.fullName,
        fatherName: createUserDto.personalInformation?.fatherName,
        nationality: createUserDto.personalInformation?.nationality,
        address: createUserDto.personalInformation?.address,
        birthDate: createUserDto.personalInformation?.birthDate,
        gender: createUserDto.personalInformation?.gender,
        phoneNo: createUserDto.personalInformation?.phoneNo,
        nationalId: createUserDto.personalInformation?.nationalId,
        photo: photo,
      },
      employmentInformation: {
        salary: createUserDto.employmentInformation?.salary,
        joiningDate: createUserDto.employmentInformation?.joiningDate,
        designation: createUserDto.employmentInformation?.designation,
        department: createUserDto.employmentInformation?.department,
        reportsTo: createUserDto.employmentInformation?.reportsTo,
        status: status,
        role: role,
        shiftHours: createUserDto.employmentInformation?.shiftHours,
      },
      leavesCounts: {
        casualLeaves: createUserDto.leavesCounts?.casualLeaves,
        sickLeaves: createUserDto.leavesCounts?.sickLeaves,
        emergencyLeaves: createUserDto.leavesCounts?.emergencyLeaves,
        workFromHome: createUserDto.leavesCounts?.workFromHome,
        annualLeaves: createUserDto.leavesCounts?.annualLeaves,
        maternityLeaves: createUserDto.leavesCounts?.maternityLeaves,
      },
      bankingInformation: {
        accountTitle: createUserDto.bankingInformation?.accountTitle,
        accountNumber: createUserDto.bankingInformation?.accountNumber,
        bankName: createUserDto.bankingInformation?.bankName,
      },
      email: email,
      password: password,
    };

    const createdUser = new this.UserModel(userData);
    return createdUser.save();
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    const where: FilterQuery<UserSchemaClass> = {};
    if (filterOptions?.roles?.length) {
      where['role._id'] = {
        $in: filterOptions.roles.map((role) => role.toString()),
      };
    }

    const users = await this.UserModel.find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === '_id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return users;
  }

  async findById(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByIds(ids: string[]) {
    const users = await this.UserModel.find({ _id: { $in: ids } });
    return users;
  }

  async findByEmail(email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.UserModel.findOne({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const user = await this.findById(id);

      if (user && user?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const user = await this.findByEmail(updateUserDto.email);

      if (user && user.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      email = updateUserDto.email;
    } else if (updateUserDto.email === null) {
      email = null;
    }

    let photo: FileType | null | undefined = undefined;

    if (updateUserDto.personalInformation?.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.personalInformation?.photo?.id,
      );
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        });
      }
      photo = fileObject;
    } else if (updateUserDto.personalInformation?.photo === null) {
      photo = null;
    }

    let role: string | undefined = undefined;

    if (updateUserDto.employmentInformation?.role) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.employmentInformation?.role));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }

      role = updateUserDto.employmentInformation?.role;
    }

    let status: string | undefined = undefined;

    if (updateUserDto.employmentInformation?.status) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.employmentInformation?.status));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }

      status = updateUserDto.employmentInformation?.status;
    }

    return this.UserModel.findByIdAndUpdate(id, {
      personalInformation: {
        fullName: updateUserDto.personalInformation?.fullName,
        fatherName: updateUserDto.personalInformation?.fatherName,
        nationality: updateUserDto.personalInformation?.nationality,
        address: updateUserDto.personalInformation?.address,
        birthDate: updateUserDto.personalInformation?.birthDate,
        gender: updateUserDto.personalInformation?.gender,
        phoneNo: updateUserDto.personalInformation?.phoneNo,
        nationalId: updateUserDto.personalInformation?.nationalId,
        photo,
      },
      employmentInformation: {
        salary: updateUserDto.employmentInformation?.salary,
        joiningDate: updateUserDto.employmentInformation?.joiningDate,
        designation: updateUserDto.employmentInformation?.designation,
        department: updateUserDto.employmentInformation?.department,
        reportsTo: updateUserDto.employmentInformation?.reportsTo,
        status: status,
        role: role,
        shiftHours: updateUserDto.employmentInformation?.shiftHours,
      },
      leavesCounts: {
        casualLeaves: updateUserDto.leavesCounts?.casualLeaves,
        sickLeaves: updateUserDto.leavesCounts?.sickLeaves,
        emergencyLeaves: updateUserDto.leavesCounts?.emergencyLeaves,
        workFromHome: updateUserDto.leavesCounts?.workFromHome,
        annualLeaves: updateUserDto.leavesCounts?.annualLeaves,
        maternityLeaves: updateUserDto.leavesCounts?.maternityLeaves,
      },
      bankingInformation: {
        accountTitle: updateUserDto.bankingInformation?.accountTitle,
        accountNumber: updateUserDto.bankingInformation?.accountNumber,
        bankName: updateUserDto.bankingInformation?.bankName,
      },
      email,
      password,
    });
  }

  async remove(id: string) {
    await this.UserModel.findByIdAndDelete(id);
  }

  async updateLeavesCounts(id: string, leaves: number, type: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const count = user.leavesCount[type];
    if (count - leaves < 0) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Leaves not enough',
        errors: {
          leaves: 'leavesNotEnough',
        },
      });
    }

    user.leavesCount[type] = leaves;

    await user.save();
    return true;
  }
}
