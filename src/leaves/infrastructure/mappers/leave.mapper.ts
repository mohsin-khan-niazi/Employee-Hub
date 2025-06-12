import { Leave, UserReference } from '../../domain/leave.types';
import { LeaveSchemaClass } from '../entities/leave.schema';

export class LeaveMapper {
  static toDomain(raw: LeaveSchemaClass): Leave {
    const domainEntity = new Leave();
    domainEntity.id = raw._id.toString();
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;

    if (raw.requestedBy && typeof raw.requestedBy === 'object') {
      domainEntity.requestedBy = raw.requestedBy as UserReference;
    } else {
      domainEntity.requestedBy = raw.requestedBy?.toString() || '';
    }

    domainEntity.type = raw.type;
    domainEntity.duration = {
      startDate: raw.duration.startDate,
      endDate: raw.duration.endDate,
      isSingleDay: raw.duration.isSingleDay,
    };
    domainEntity.numberOfDays = raw.numberOfDays;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.reviewedBy && typeof raw.reviewedBy === 'object') {
      domainEntity.reviewedBy = raw.reviewedBy as UserReference;
    } else if (raw.reviewedBy) {
      domainEntity.reviewedBy = raw.reviewedBy.toString();
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Leave): LeaveSchemaClass {
    const persistenceSchema = new LeaveSchemaClass();

    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }

    persistenceSchema.title = domainEntity.title;
    persistenceSchema.description = domainEntity.description;

    persistenceSchema.requestedBy = domainEntity.requestedBy?.toString();

    persistenceSchema.type = domainEntity.type;
    persistenceSchema.duration = {
      startDate: domainEntity.duration.startDate,
      endDate: domainEntity.duration.endDate,
      isSingleDay: domainEntity.duration.isSingleDay,
    };
    persistenceSchema.numberOfDays = domainEntity.numberOfDays;
    persistenceSchema.status = domainEntity.status;

    persistenceSchema.reviewedBy = domainEntity.reviewedBy?.toString();

    return persistenceSchema;
  }

  static toDomainList(documents: LeaveSchemaClass[]): Leave[] {
    return documents.map((document) => this.toDomain(document));
  }
}
