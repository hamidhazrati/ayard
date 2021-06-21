import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

export const listCashflowsCrumb = (): Breadcrumb[] => {
  return [
    ...dashboardCrumb(),
    {
      link: '/cashflows',
      title: 'Cashflows',
    },
  ];
};
