export interface ProductCounterpartyRole {
  name: string;
  description: string;
  type: CounterpartyRoleTypeCode;
  required: boolean;
}

export type CounterpartyRoleTypeCode = 'PRIMARY' | 'RELATED' | 'OTHER';
export const COUNTERPARTY_ROLE_TYPE_LABELS = {
  PRIMARY: 'Primary',
  RELATED: 'Related',
  OTHER: 'Other',
};
