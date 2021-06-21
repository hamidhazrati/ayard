import { Breadcrumb } from '../../shared/components/breadcrumbs/breadcrumb.model';
import { listProductsCrumb } from '../products/components/list-products/list-products.crumb';

export const counterPartyRolesCrumb = (): Breadcrumb[] => {
  return [
    ...listProductsCrumb(),
    {
      link: '/counterparty-roles',
      title: 'Counterparty Roles',
    },
  ];
};
