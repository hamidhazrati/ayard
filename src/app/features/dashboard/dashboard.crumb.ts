import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';

export const dashboardCrumb = (): Breadcrumb[] => {
  return [
    {
      link: '/',
      title: 'Home',
    },
  ];
};
