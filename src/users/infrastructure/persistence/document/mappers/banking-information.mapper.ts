import { BankingInformation as DomainBankingInformation } from '../../../../domain/banking-information';
import { BankingInformation as SchemaBankingInformation } from '../entities/banking-information.schema';

export class BankingInformationMapper {
  static toDomain(raw: SchemaBankingInformation): DomainBankingInformation {
    const domainEntity = new DomainBankingInformation();

    domainEntity.bankName = raw.bankName ?? null;
    domainEntity.accountTitle = raw.accountTitle ?? null;
    domainEntity.accountNumber = raw.accountNumber ?? null;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: DomainBankingInformation,
  ): SchemaBankingInformation {
    const persistenceSchema = new SchemaBankingInformation();

    persistenceSchema.bankName = domainEntity.bankName;
    persistenceSchema.accountTitle = domainEntity.accountTitle;
    persistenceSchema.accountNumber = domainEntity.accountNumber;

    return persistenceSchema;
  }
}
