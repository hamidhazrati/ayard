import { Matchers } from '@pact-foundation/pact';
import { UploadCashflowFileResponse } from '@cashflows/services/upload-cashflow-file-response';

const { like } = Matchers;

export const postCashflowFileMatcher = {
  id: like('id'),
  clientName: like('clientName'),
  filename: like('filename'),
  uploadDate: like('uploadDate'),
  uploadedBy: like('uploadedBy'),
  cashflowRowCount: like('1'),
  status: like('status'),
};

export const postCashflowFileCreated: UploadCashflowFileResponse = {
  id: 'id',
  clientName: 'clientName',
  filename: 'filename',
  uploadDate: 'uploadDate',
  uploadedBy: 'uploadedBy',
  cashflowRowCount: 1,
  status: 'status',
};
