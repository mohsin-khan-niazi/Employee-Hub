import { Leaves as DomainLeaves } from '../../domain/leaves';
import { Leaves as SchemaLeaves } from '../entities/leaves.schema';

export class LeavesMapper {
  static toDomain(raw: SchemaLeaves): DomainLeaves {
    const domainEntity = new DomainLeaves();

    domainEntity.casualLeaves = raw.casualLeaves ?? null;
    domainEntity.sickLeaves = raw.sickLeaves ?? null;
    domainEntity.emergencyLeaves = raw.emergencyLeaves ?? null;
    domainEntity.workFromHome = raw.workFromHome ?? null;
    domainEntity.annualLeaves = raw.annualLeaves ?? null;
    domainEntity.maternityLeaves = raw.maternityLeaves ?? null;

    return domainEntity;
  }

  static toPersistence(domainEntity: DomainLeaves): SchemaLeaves {
    const persistenceSchema = new SchemaLeaves();

    persistenceSchema.casualLeaves = domainEntity.casualLeaves ?? 12;
    persistenceSchema.sickLeaves = domainEntity.sickLeaves ?? 12;
    persistenceSchema.emergencyLeaves = domainEntity.emergencyLeaves ?? 8;
    persistenceSchema.workFromHome = domainEntity.workFromHome ?? 22;
    persistenceSchema.annualLeaves = domainEntity.annualLeaves ?? 12;
    persistenceSchema.maternityLeaves = domainEntity.maternityLeaves ?? 60;

    return persistenceSchema;
  }
}
