import { User } from '../../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { PersonalInformationMapper } from './personal-information.mapper';
import { EmploymentInformationMapper } from './employment-information.mapper';
import { LeavesMapper } from './leaves.mapper';
import { BankingInformationMapper } from './banking-information.mapper';
export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;

    if (raw.personalInformation) {
      domainEntity.personalInformation = PersonalInformationMapper.toDomain(
        raw.personalInformation,
      );
    }

    if (raw.employmentInformation) {
      domainEntity.employmentInformation = EmploymentInformationMapper.toDomain(
        raw.employmentInformation,
      );
    }

    if (raw.leavesCount) {
      domainEntity.leavesCounts = LeavesMapper.toDomain(raw.leavesCount);
    }

    if (raw.bankingInformation) {
      domainEntity.bankingInformation = BankingInformationMapper.toDomain(
        raw.bankingInformation,
      );
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    const persistenceSchema = new UserSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }

    persistenceSchema.email = domainEntity.email;
    persistenceSchema.password = domainEntity.password;

    if (domainEntity.personalInformation) {
      persistenceSchema.personalInformation =
        PersonalInformationMapper.toPersistence(
          domainEntity.personalInformation,
        );
    }

    if (domainEntity.employmentInformation) {
      persistenceSchema.employmentInformation =
        EmploymentInformationMapper.toPersistence(
          domainEntity.employmentInformation,
        );
    }

    if (domainEntity.leavesCounts) {
      persistenceSchema.leavesCount = LeavesMapper.toPersistence(
        domainEntity.leavesCounts,
      );
    }
    if (domainEntity.bankingInformation) {
      persistenceSchema.bankingInformation =
        BankingInformationMapper.toPersistence(domainEntity.bankingInformation);
    }

    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
