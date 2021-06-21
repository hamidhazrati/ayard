import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { contractsCrumb } from '@app/features/contracts/contracts.crumb';

export const createContractCrumb = (): Breadcrumb[] => {
  return [
    ...contractsCrumb(),
    {
      link: '/contracts/new',
      title: 'Create new contract',
    },
  ];
};
