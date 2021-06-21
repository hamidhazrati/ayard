export type CounterpartyStatus = 'ACTIVE' | 'INACTIVE';

export type CounterpartyCreditStatus = 'APPROVED' | 'REJECTED';

import { OmitId, PickId } from '@app/shared/model/model-helpers';
import { Contract } from './contract.model';
import { Bank } from './counterparty-bank';
import { CounterpartyRoleTypeCode } from '@app/features/products/models/product-counterparty-role.model';

export interface Counterparty {
  id: string;
  name: string;
  contractId: string;
  entityId: string;
  role: string;
  roleType: CounterpartyRoleTypeCode;
  counterpartyReference: string;
  countryOfOperation: string;
  references?: string[];
  marginRate?: number;
  banks?: Bank[];
}

export type CreatedCounterparty = PickId<Counterparty>;
export type CreateUpdateCounterparty = Omit<OmitId<Counterparty>, 'roleType'>;

export interface CounterpartyException {
  code: string;
  message: string;
}

export interface ContractCounterparty {
  name: string;
  role: string;
  roleType: CounterpartyRoleTypeCode;
  id: string;
  entityId?: string;
  counterpartyReference: string;
  verificationStatus?: CounterpartyStatus;
  references?: string[];
  exceptions?: CounterpartyException[];
  marginRate?: number;
  marginRateOverridden?: boolean;
  contract?: Contract;
  banks?: Bank[];
}
