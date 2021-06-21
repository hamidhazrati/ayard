import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { listOriginationProposalsCrumb } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.crumb';

export const viewOriginationProposalCrumb = (cashflowFileId: string): Breadcrumb[] => {
  return [
    ...listOriginationProposalsCrumb(),
    {
      link: `/cashflows/files/${cashflowFileId}/proposals`,
      title: `${cashflowFileId}`,
    },
  ];
};
