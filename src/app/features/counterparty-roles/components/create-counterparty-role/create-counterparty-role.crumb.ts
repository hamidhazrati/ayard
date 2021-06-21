import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { counterPartyRolesCrumb } from '@app/features/counterparty-roles/counter-party-roles.crumb';

export const createCounterpartyRoleCrumb = (): Breadcrumb[] => {
  return [
    ...counterPartyRolesCrumb(),
    {
      link: '/counterparty-roles/new',
      title: 'New Counterparty Role',
    },
  ];
};
