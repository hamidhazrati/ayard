import { Address } from '@entities/models/address.model';

export interface DnbLookup {
  legalEntityName: string;
  address: Address;
}
