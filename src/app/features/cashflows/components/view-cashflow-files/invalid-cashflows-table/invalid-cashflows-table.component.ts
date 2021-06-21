import { Component, Input } from '@angular/core';
import { CashflowSummary } from '@app/features/cashflows/models/cashflow-summary';
import { cashflowsTableColumns } from '@cashflows/services/cashflow.service';
import { GdsColumn, GdsPaginationMeta, SortDirection } from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';

@Component({
  selector: 'app-invalid-cashflows-table',
  templateUrl: './invalid-cashflows-table.component.html',
})
export class InvalidCashflowsTableComponent {
  @Input()
  cashflows: CashflowSummary[];

  @Input()
  public hasUnprocessedCashflows: boolean;

  public paginationMeta: GdsPaginationMeta = {
    externalSorting: false,
  };
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'issueDate',
      dir: SortDirection.desc,
    },
  ];

  public columns: GdsColumn[] = [
    ...cashflowsTableColumns,
    {
      prop: 'invalidReason',
      name: 'Invalid Reason',
      columnWidth: 600,
    },
  ];
}
