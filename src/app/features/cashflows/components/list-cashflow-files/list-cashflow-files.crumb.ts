import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

export const listCashflowFilesCrumb = (): Breadcrumb[] => {
  return [
    ...dashboardCrumb(),
    {
      link: '/cashflows/files',
      title: 'Cashflow Files',
    },
  ];
};
