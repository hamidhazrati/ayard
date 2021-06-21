import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

export const listPartnersCrumb = (): Breadcrumb[] => {
  return [
    ...dashboardCrumb(),
    {
      link: '/partners',
      title: 'Partners',
    },
  ];
};
