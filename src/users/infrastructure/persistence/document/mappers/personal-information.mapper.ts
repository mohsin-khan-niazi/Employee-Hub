import { PersonalInformation as DomainPersonalInformation } from '../../../../domain/personal-information';
import { PersonalInformation as SchemaPersonalInformation } from '../entities/personal-information.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';

export class PersonalInformationMapper {
  static toDomain(raw: SchemaPersonalInformation): DomainPersonalInformation {
    const domainEntity = new DomainPersonalInformation();
    domainEntity.firstName = raw.first_name;
    domainEntity.lastName = raw.last_name;
    domainEntity.fullName = raw.full_name;
    domainEntity.fatherName = raw.father_name;
    domainEntity.nationality = raw.nationality;
    domainEntity.address = raw.address;
    domainEntity.birthDate = raw.birth_date;
    domainEntity.gender = raw.gender;
    domainEntity.phoneNo = raw.phone_no;
    domainEntity.nationalId = raw.national_id;

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
    persistenceSchema.first_name = domainEntity.firstName;
    persistenceSchema.last_name = domainEntity.lastName;
    persistenceSchema.father_name = domainEntity.fatherName;
    persistenceSchema.nationality = domainEntity.nationality;
    persistenceSchema.address = domainEntity.address;
    persistenceSchema.birth_date = domainEntity.birthDate;
    persistenceSchema.gender = domainEntity.gender;
    persistenceSchema.phone_no = domainEntity.phoneNo;
    persistenceSchema.national_id = domainEntity.nationalId;

    if (domainEntity.photo) {
      persistenceSchema.photo = FileMapper.toPersistence(domainEntity.photo);
    }

    return persistenceSchema;
  }
}
