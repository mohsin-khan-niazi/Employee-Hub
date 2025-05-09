import { User } from '../../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { PersonalInformationMapper } from './personal-information.mapper';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.role = raw.role;
    domainEntity.status = raw.status;

    if (raw.personalInformation) {
      domainEntity.personalInformation = PersonalInformationMapper.toDomain(
        raw.personalInformation,
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
    persistenceSchema.role = domainEntity.role;
    persistenceSchema.status = domainEntity.status;

    if (domainEntity.personalInformation) {
      persistenceSchema.personalInformation =
        PersonalInformationMapper.toPersistence(
          domainEntity.personalInformation,
        );
    }

    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
