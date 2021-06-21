import { CounterpartyRoleTypeCode } from '@app/features/products/models/product-counterparty-role.model';

interface CounterpartyRoleTypeSelectOption {
  code: CounterpartyRoleTypeCode;
  description: string;
}

export const COUNTERPARTY_ROLE_TYPES_SELECT_OPTIONS: CounterpartyRoleTypeSelectOption[] = [
  { code: 'PRIMARY', description: 'Primary' },
  { code: 'RELATED', description: 'Related' },
  { code: 'OTHER', description: 'Other' },
];
