import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { Matchers } from '@pact-foundation/pact';

const { like, eachLike } = Matchers;

export const getCounterpartyRoles: CounterpartyRole[] = [
  {
    id: 'id',
    name: 'name',
    description: 'description',
    required: true,
  },
];

export const getCounterpartyRoleMatcher = {
  id: like('id'),
  name: like('name'),
  description: like('description'),
  required: like(true),
};

export const getCounterpartyRolesMatcher = eachLike(getCounterpartyRoleMatcher);

export const postCounterpartyRoleMatcher = {
  id: like('b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
};

export const postCounterpartyRoleCreated = {
  id: 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
};
