import { PersonalInformation as DomainPersonalInformation } from '../../domain/personal-information';
import { PersonalInformation as SchemaPersonalInformation } from '../entities/personal-information.schema';
import { FileMapper } from '../../../files/infrastructure/persistence/document/mappers/file.mapper';

export class PersonalInformationMapper {
  static toDomain(raw: SchemaPersonalInformation): DomainPersonalInformation {
    const domainEntity = new DomainPersonalInformation();
    domainEntity.fullName = raw.fullName;
    domainEntity.fatherName = raw.fatherName;
    domainEntity.nationality = raw.nationality;
    domainEntity.address = raw.address;
    domainEntity.birthDate = raw.birthDate;
    domainEntity.gender = raw.gender;
    domainEntity.phoneNo = raw.phoneNo;
    domainEntity.nationalId = raw.nationalId;

    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo);
    } else if (raw.photo === null) {
      domainEntity.photo = null;
    }

    return domainEntity;
  }

  static toPersistence(
    domainEntity: DomainPersonalInformation,
  ): SchemaPersonalInformation {
    const persistenceSchema = new SchemaPersonalInformation();
    persistenceSchema.fullName = domainEntity.fullName;
    persistenceSchema.fatherName = domainEntity.fatherName;
    persistenceSchema.nationality = domainEntity.nationality;
    persistenceSchema.address = domainEntity.address;
    persistenceSchema.birthDate = domainEntity.birthDate;
    persistenceSchema.gender = domainEntity.gender;
    persistenceSchema.phoneNo = domainEntity.phoneNo;
    persistenceSchema.nationalId = domainEntity.nationalId;

    if (domainEntity.photo) {
      persistenceSchema.photo = FileMapper.toPersistence(domainEntity.photo);
    }

    return persistenceSchema;
  }
}
