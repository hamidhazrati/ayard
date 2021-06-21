import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { CashflowFile } from '../../models/cashflow-file';
import { listCashflowFilesCrumb } from '../list-cashflow-files/list-cashflow-files.crumb';

export const viewCashflowFileCrumb = (cashflowFile: CashflowFile): Breadcrumb[] => {
  return [
    ...listCashflowFilesCrumb(),
    {
      link: `/cashflows/files/${cashflowFile.id}`,
      title: cashflowFile.id,
    },
  ];
};
