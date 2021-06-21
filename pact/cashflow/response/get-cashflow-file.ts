import { eachLike, like } from '@pact-foundation/pact/dsl/matchers';
import { CashflowFile } from '../../../src/app/features/cashflows/models';
import { RejectedDetail } from '../../../src/app/features/cashflows/models/cashflow-file';

export const rejectedDetail: RejectedDetail = {
  user: 'user',
  message: 'message',
  date: '2020-10-01',
};

export const getCashflowFileBody: CashflowFile = {
  id: 'id',
  clientName: 'clientName',
  filename: 'filename',
  uploadDate: 'uploadDate',
  uploadedBy: 'uploadedBy',
  status: 'status',
  cashflowRowCount: 1,
  cashflowTotals: [
    {
      cashflowFileId: 'cashflowFileId',
      currency: 'currency',
      totalCashflows: 1,
      totalValidCashflows: 1,
      totalOriginalValue: 1,
      totalInitialFundingAmount: 1,
      totalInvalidCashflows: 1,
      totalInvalidOriginalValue: 1,
      totalInvalidInitialFundingAmount: 1,
    },
  ],
  processingFailureMessages: [{ message: 'message', rowFailed: 1 }],
  rejectionDetail: rejectedDetail,
  processedDate: 'processedDate',
  processedBy: 'processedBy',
  latestExport: 1,
  exports: [{ sequence: 1, filename: 'filename' }],
};

export const getCashflowFileMatcher = {
  id: like('id'),
  clientName: like('clientName'),
  filename: like('filename'),
  uploadDate: like('uploadDate'),
  uploadedBy: like('uploadedBy'),
  status: like('status'),
  cashflowRowCount: like(1),
  cashflowTotals: eachLike({
    cashflowFileId: like('cashflowFileId'),
    currency: like('currency'),
    totalCashflows: like(1),
    totalValidCashflows: like(1),
    totalOriginalValue: like(1),
    totalInitialFundingAmount: like(1),
    totalInvalidCashflows: like(1),
    totalInvalidOriginalValue: like(1),
    totalInvalidInitialFundingAmount: like(1),
  }),
  processingFailureMessages: eachLike({ message: like('message'), rowFailed: like(1) }),
  rejectionDetail: like(rejectedDetail),
  processedDate: like('processedDate'),
  processedBy: like('processedBy'),
  latestExport: like(1),
  exports: eachLike({ sequence: like(1), filename: like('filename') }),
};
