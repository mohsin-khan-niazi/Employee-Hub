import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UsersRepository } from './infrastructure/user.repository';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { FilesService } from '../files/files.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FileType } from '../files/domain/file';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let password: string | undefined = undefined;

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(createUserDto.password, salt);
    }

    let email: string | null = null;

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      );
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

    return this.usersRepository.create(userData as User);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    let password: string | undefined = undefined;

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id);

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(updateUserDto.password, salt);
      }
    }

    let email: string | null | undefined = undefined;

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userObject && userObject.id !== id) {
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

    return this.usersRepository.update(id, {
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

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
