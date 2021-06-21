import { Page } from '@app/shared/pagination';
import { Partner } from '../../../src/app/features/partners/model/partner.model';

export const PARTNERS_LIST: Partner[] = [
  {
    id: '5fed977a94c907454bfffabb',
    name: 'COUPA',
    entityId: 'entity-id',
  },
  {
    id: '5ff5fac22f1d847be7ff79be',
    name: 'COUPA1',
    entityId: 'entity-id2',
  },
  {
    id: '5ff5fad22f1d847be7ff79c1',
    name: 'COUPA21',
    entityId: 'ent2ity-id2',
  },
  {
    id: '5ff6f7102f1d847be7ff79c2',
    name: 'COUPA4',
    entityId: 'ent2ity-id4',
  },
  {
    id: '5ff6f7212f1d847be7ff79c3',
    name: 'COUPA6',
    entityId: 'ent2ity-id6',
  },
];

export const PARTNERS_PAGE: Page<Partner> = {
  data: PARTNERS_LIST,
  meta: {
    paged: {
      size: 5,
      page: 0,
      totalPages: 1,
      pageSize: 10,
      totalSize: 5,
    },
  },
};
