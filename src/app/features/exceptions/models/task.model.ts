import { TaskStatus } from './task-status.model';

export interface Task {
  attributes: TaskAttributes;
  availableActions: string[];
  createdDate: string;
  id: string;
  lastActionedBy: string;
  message: string;
  previousStatuses?: TaskStatus[];
  primaryEntity?: string;
  relatedEntity?: string;
  resourceType: string;
  sourceId: string;
  status?: string;
  statusInfo: TaskStatus;
  type: string;
}

export interface TaskAttributes {
  cashflowFileId: string;
  cashflowStatus: string;
  certifiedAmount: any;
  certifiedAmountCurrency: string;
  contractId: string;
  contractName: string;
  documentReference: any;
  dueDate: string;
  facilityId: string;
  facilityName: string;
  issueDate: string;
  primaryEntity: string;
  primaryEntityRole: string;
  relatedEntity: string;
  relatedEntityRole: string;
  resourceId: string;
}
