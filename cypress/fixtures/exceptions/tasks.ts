import { Page } from '@app/shared/pagination';
import { Task } from '@app/features/exceptions/models/task.model';

export const EXCEPTIONS_LIST: Task[] = [
  {
    id: '1234',
    resourceType: 'CASHFLOW',
    attributes: {
      contractId: 'contract-1',
      cashflowStatus: '',
      contractName: 'Some Contract',
      resourceId: 'cash-1',
      cashflowFileId: 'file-2',
      documentReference: 'Some doc ref',
      issueDate: '2020-09-14T06:30:01.123Z',
      dueDate: '2020-09-14T06:30:01.123Z',
      facilityId: '123456',
      facilityName: 'Some Contract',
      primaryEntity: 'Some Primary Entity 22',
      primaryEntityRole: 'Some Primary Role',
      relatedEntity: 'Some Related Entity',
      relatedEntityRole: 'Some Related Entity Role',
      certifiedAmount: 25000,
      certifiedAmountCurrency: 'USD',
    },
    sourceId: '22',
    type: 'MAX_TENOR',
    message: 'Tenor of 61 is greater than the max allowed tenor of 60',
    availableActions: ['OVERRIDE', 'REJECT', 'RELEASE'],
    statusInfo: {
      status: 'RAISED',
      updated: '2020-09-18T09:58:10.023Z',
    },
    createdDate: '2020-09-18T09:58:10.023Z',
    lastActionedBy: 'N/A',
  },
  {
    id: '1290',
    resourceType: 'CASHFLOW',
    attributes: {
      contractId: '7990f75f-9e3f-4674-ba9f-4a60027d7873',
      contractName: 'Some Contract',
      resourceId: 'cash-1',
      cashflowFileId: 'file-2',
      documentReference: 'Some doc ref',
      issueDate: '2020-09-14T06:30:01.123Z',
      dueDate: '2020-09-14T06:30:01.123Z',
      facilityId: '5ce32270-e63d-4e21-8fea-48fec58de6d4',
      facilityName: 'Some facility',
      primaryEntity: 'Some Primary Entity 22',
      primaryEntityRole: 'Some Primary Role',
      relatedEntity: 'Some Related Entity',
      relatedEntityRole: 'Some Related Entity Role',
      certifiedAmount: 25000,
      certifiedAmountCurrency: 'USD',
      cashflowStatus: 'REJECTED',
    },
    sourceId: '33',
    type: 'MAX_TENOR',
    message: 'Tenor of 61 is greater than the max allowed tenor of 60',
    availableActions: ['OVERRIDE', 'REJECT', 'RELEASE'],
    statusInfo: {
      status: 'RAISED',
      updated: '2020-09-18T09:58:10.023Z',
      updatedBy: null,
      reason: null,
    },
    createdDate: '2020-09-18T09:58:10.023Z',
    lastActionedBy: 'N/A',
  },
];

export const EXCEPTIONS_PAGE: Page<Task> = {
  data: EXCEPTIONS_LIST,
  meta: {
    paged: {
      size: 2,
      page: 0,
      totalPages: 1,
      pageSize: 10,
      totalSize: 2,
    },
  },
};
