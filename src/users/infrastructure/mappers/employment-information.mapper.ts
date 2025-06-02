import { EmploymentInformation as DomainEmploymentInformation } from '../../domain/employment.information';
import { EmploymentInformation as SchemaEmploymentInformation } from '../entities/employment-information.schema';
import { Types } from 'mongoose';

export class EmploymentInformationMapper {
  static toDomain(
    raw: SchemaEmploymentInformation,
  ): DomainEmploymentInformation {
    const domainEntity = new DomainEmploymentInformation();

    domainEntity.salary = raw.salary
      ? {
          pkr: raw.salary.pkr ?? null,
          aed: raw.salary.aed ?? null,
          exchangeRate: raw.salary.exchangeRate ?? null,
        }
      : undefined;

    domainEntity.joiningDate = raw.joiningDate ?? null;
    domainEntity.designation = raw.designation ?? null;
    domainEntity.department = raw.department ?? null;
    domainEntity.reportsTo = raw.reportsTo ?? null;
    domainEntity.status = raw.status ?? null;
    domainEntity.role = raw.role ?? null;

    domainEntity.shiftHours = raw.shiftHours
      ? {
          start: raw.shiftHours.start ?? null,
          end: raw.shiftHours.end ?? null,
        }
      : undefined;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: DomainEmploymentInformation,
  ): SchemaEmploymentInformation {
    const persistenceSchema = new SchemaEmploymentInformation();

    persistenceSchema.salary = domainEntity.salary
      ? {
          pkr: domainEntity.salary.pkr ?? null,
          aed: domainEntity.salary.aed ?? null,
          exchangeRate: domainEntity.salary.exchangeRate ?? null,
        }
      : undefined;

    persistenceSchema.joiningDate = domainEntity.joiningDate ?? null;
    persistenceSchema.designation = domainEntity.designation ?? null;
    persistenceSchema.department = domainEntity.department ?? null;
    persistenceSchema.reportsTo = domainEntity.reportsTo
      ? new Types.ObjectId(domainEntity.reportsTo)
      : null;
    persistenceSchema.status = domainEntity.status ?? null;
    persistenceSchema.role = domainEntity.role ?? null;

    persistenceSchema.shiftHours = domainEntity.shiftHours
      ? {
          start: domainEntity.shiftHours.start ?? null,
          end: domainEntity.shiftHours.end ?? null,
        }
      : undefined;

    return persistenceSchema;
  }
}
