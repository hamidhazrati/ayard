import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

export const listProductsCrumb = (): Breadcrumb[] => {
  return [
    ...dashboardCrumb(),
    {
      link: '/products',
      title: 'Products',
    },
  ];
};
