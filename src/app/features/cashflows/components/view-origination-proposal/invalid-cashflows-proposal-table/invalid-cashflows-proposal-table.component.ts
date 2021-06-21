import { Component, Input } from '@angular/core';
import { CashflowSummary } from '@app/features/cashflows/models/cashflow-summary';

@Component({
  selector: 'app-invalid-cashflows-proposal-table',
  templateUrl: './invalid-cashflows-proposal-table.component.html',
})
export class InvalidCashflowsProposalTableComponent {
  @Input()
  cashflowSummaries: CashflowSummary[];

  columnsToDisplay: string[] = [
    'entityOne',
    'entityTwo',
    'invoiceId',
    'issueDate',
    'dueDate',
    'CCY',
    'invoiceAmount',
    'fmvAmount',
    'expectedPaymentDate',
    'invalidReason',
  ];

  constructor() {}

  getFailureMessageTooltip(cashflow: CashflowSummary): string {
    let tooltip = '';
    cashflow.reasonForFailure.forEach((element) => {
      tooltip += element.message + '\n';
    });
    return tooltip;
  }
}
