import { TaskStatus } from '@app/features/exceptions/models/task-status.model';
import { Task } from '@app/features/exceptions/models/task.model';
import { Matchers } from '@pact-foundation/pact';
import { term } from '@pact-foundation/pact/dsl/matchers';

const { like, eachLike, iso8601Date } = Matchers;

export const taskStatus: TaskStatus = {
  reason: 'reason',
  updatedBy: 'updated-by',
  updated: 'updated',
  status: 'RELEASE',
};

export const taskStatusMatcher = {
  reason: like('reason'),
  updatedBy: like('updated-by'),
  updated: like('updated'),
  status: term({
    matcher:
      'RELEASE|RAISED|IN_REVIEW_OVERRIDE|IN_REVIEW_RELEASE|OVERRIDE|REJECT|CLOSE|IN_REVIEW_REJECT',
    generate: 'RELEASE',
  }),
};

export const getTaskBody: Task = {
  id: 'task-id',
  resourceType: 'resource-type',
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
  sourceId: 'source-id',
  type: 'type',
  message: 'message',
  availableActions: ['action-1'],
  statusInfo: taskStatus,
  previousStatuses: [taskStatus],
  createdDate: '2020-10-01',
  lastActionedBy: '2020-10-01',
};

export const getTaskMatcher = {
  id: like('task-id'),
  resourceType: like('resource-type'),
  attributes: like('attribute'),
  sourceId: like('source-id'),
  type: like('type'),
  message: like('message'),
  availableActions: eachLike('action-1'),
  statusInfo: taskStatusMatcher,
  previousStatuses: eachLike(taskStatusMatcher),
  createdDate: iso8601Date('2020-10-01'),
  lastActionedBy: iso8601Date('2020-10-01'),
};
