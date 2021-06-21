import { CreateUpdateCounterparty } from '../../../src/app/features/contracts/models/counterparty.model';

export const postCounterparty: CreateUpdateCounterparty = {
  name: 'name',
  contractId: 'contractId',
  entityId: 'entityId',
  role: 'role',
  counterpartyReference: 'counterpartyReference',
  countryOfOperation: 'countryOfOperation',
  references: ['reference'],
};
