import { ContractStatus } from '@app/features/contracts/models/contract.model';

export interface ContractFields {
  name: string;
  status: ContractStatus;
}
