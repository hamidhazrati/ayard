import { CreateUpdateCounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

export const postCounterpartyRole: CreateUpdateCounterpartyRole = {
  name: 'name',
  description: 'description',
  required: true,
};
