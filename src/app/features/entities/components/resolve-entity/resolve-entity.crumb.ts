import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

export const resolveEntityCrumb = (): Breadcrumb[] => {
  return [
    ...dashboardCrumb(),
    {
      link: '/entities/resolve',
      title: 'Resolve Entities',
    },
  ];
};
