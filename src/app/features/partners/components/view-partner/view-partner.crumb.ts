import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { Partner } from '@app/features/partners/model/partner.model';
import { listPartnersCrumb } from '@app/features/partners/components/list-partners/list-partners.crumb';

export const viewPartnerCrumb = (partner: Partner): Breadcrumb[] => {
  return [
    ...listPartnersCrumb(),
    {
      link: `/partners/${partner.id}`,
      title: partner.name,
    },
  ];
};
