import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listPartnersCrumb } from '@app/features/partners/components/list-partners/list-partners.crumb';

export const createPartnerCrumb = (): Breadcrumb[] => {
  return [
    ...listPartnersCrumb(),
    {
      link: '/partners/new',
      title: 'Create new partner',
    },
  ];
};
