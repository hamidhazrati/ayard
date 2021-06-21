import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listFacilitiesCrumb } from '@app/features/facilities/components/list-facilities/list-facilities.crumb';

export const createFacilityCrumb = (): Breadcrumb[] => {
  return [
    ...listFacilitiesCrumb(),
    {
      title: 'Create new limit configuration',
    },
  ];
};
