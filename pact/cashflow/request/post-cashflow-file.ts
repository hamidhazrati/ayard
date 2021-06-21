import { Matchers } from '@pact-foundation/pact';
import { CashflowStatusUpdate } from '../../../src/app/features/cashflows/models/cashflow-file';
import { RejectCashflow } from '../../../src/app/features/cashflows/services/cashflow-data.service';

const { like } = Matchers;

export const cashflowStatusUpdate: CashflowStatusUpdate = {
  status: 'status',
  message: 'message',
  user: 'user',
};

export const rejectCashflow: RejectCashflow = {
  id: 'id',
  message: 'message',
};

export const rejectCashflows: RejectCashflow[] = [rejectCashflow];
