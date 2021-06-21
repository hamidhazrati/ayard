import { Matchers } from '@pact-foundation/pact';
import { Partner } from '@app/features/partners/model/partner.model';

const { like } = Matchers;

export const getPartnerBody: Partner = {
  id: 'id',
  name: 'name',
  entityId: 'entity-id',
};

export const getPartnerMatcher = {
  id: like('id'),
  name: like('name'),
  entityId: like('entity-id'),
};
