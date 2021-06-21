import { OmitId, PickId } from '@app/shared/model/model-helpers';
export type Address = {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
};
export type Branch = {
  name: string;
  address: Address;
  bic: string;
  domesticBranchId: string;
};
export type BankAccount = {
  name: string;
  iban: string;
  domesticAccountId: string;
};

export interface Bank {
  id: string;
  currency: string;
  bankName: string;
  branch: Branch;
  account: BankAccount;
}

export type BankRequest = OmitId<Bank>;
export type CreatedBank = PickId<Bank>;
