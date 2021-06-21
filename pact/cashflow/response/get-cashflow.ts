import { eachLike, like } from '@pact-foundation/pact/dsl/matchers';
import { Cashflow } from '../../../src/app/features/cashflows/models';

export const getCashflowBody: Cashflow = {
  id: 'id',
  cashflowFileId: 'cashflowFileId',
  state: 'state',
  currency: 'currency',
  unitPrice: 123,
  certifiedAmount: 123,
  documentReference: 'documentReference',
  issueDate: 'issueDate',
  originalDueDate: 'originalDueDate',
  originalValue: 123,
  fundingAmount: 123,
};

export const getCashflowMatcher = {
  id: like('id'),
  cashflowFileId: like('cashflowFileId'),
  state: like('state'),
  currency: like('currency'),
  unitPrice: like(123),
  certifiedAmount: like(123),
  documentReference: like('documentReference'),
  issueDate: like('issueDate'),
  originalDueDate: like('originalDueDate'),
  originalValue: like(123),
  fundingAmount: like(123),
};

export const getCashflowsBody: Cashflow[] = [getCashflowBody];

export const getCashflowsBodymatcher = eachLike(getCashflowBody);
