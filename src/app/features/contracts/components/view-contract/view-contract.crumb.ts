import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { Contract } from '../../models/contract.model';
import { listContractsCrumb } from '@app/features/contracts/components/list-contracts/list-contracts.crumb';

export const viewContractCrumb = (contract: Contract): Breadcrumb[] => {
  return [
    ...listContractsCrumb(),
    {
      link: `/contracts/${contract.id}`,
      title: contract.name,
    },
  ];
};
