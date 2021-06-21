import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CashflowSummary,
  ProposalCashflowsWithFacility,
} from '@app/features/cashflows/models/cashflow-summary';
import { MatDialog } from '@angular/material/dialog';
import { UnacceptedCashflowDialogueComponent } from './unaccepted-cashflow-dialogue/unaccepted-cashflow-dialogue.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { RejectCashflow } from '@app/features/cashflows/services/cashflow-data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isNegative } from '@app/shared/utils/number-util';

@Component({
  selector: 'app-proposal-table-component',
  templateUrl: './proposal-table.component.html',
  styleUrls: ['./proposal-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProposalTableComponent implements OnInit, OnChanges {
  @Input()
  proposalCashflowsWithFacilities: ProposalCashflowsWithFacility[];

  @Input()
  disableAccept: boolean;

  @Input()
  cancelled: boolean;

  @Output()
  unacceptedCashflowsEvent = new EventEmitter();

  public selection = new SelectionModel<CashflowSummary>(true, []);

  private unacceptedCashflows: RejectCashflow[];

  parentTableColumns: string[] = [
    'accountDebtor',
    'noOfCashflows',
    'CCY',
    'newCashflowsAmount',
    'currentOutstanding',
    'totalIfPurchased',
    'limit',
    'utilisation',
    'availableLimit',
    'latestMaturityDate',
    'insuranceLimit',
    'insuranceAvailable',
    'insuranceLimitType',
    'insured',
  ];

  nestedTableColumns: string[] = [
    'entityTwo',
    'documentReference',
    'issueDate',
    'originalDueDate',
    'currency',
    'originalValue',
    'fundingAmount',
    'contract.advanceRate',
    'price.annualisedMarginRate',
    'price.maturityDate',
    'price.settlementAmount',
    'accept',
  ];

  public expandedElement: CashflowSummary | null;

  constructor(public dialog: MatDialog) {
    this.unacceptedCashflows = [];
  }

  ngOnInit(): void {
    this.setSelects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cancelled === true) {
      this.unacceptedCashflows = [];
      this.setSelects();
    }

    // set selects to checked when user changes tab
    if (changes?.proposalCashflowsWithFacilities) {
      this.setSelects();
    }
  }

  handleCheckboxChange(matCheckboxChange: MatCheckboxChange, row: CashflowSummary): void {
    this.selection.toggle(row);

    this.handleUnchecked(matCheckboxChange, row);

    this.handleChecked(matCheckboxChange, row);
  }

  isNegative(num: number): boolean {
    return isNegative(num);
  }

  private setSelects() {
    this.proposalCashflowsWithFacilities?.forEach((row) => {
      row.cashflows.forEach((cfRow) => this.selection.select(cfRow));
    });
  }

  private handleUnchecked(matCheckboxChange: MatCheckboxChange, row: CashflowSummary): void {
    const { id } = row;

    if (matCheckboxChange.checked === false) {
      const dialogRef = this.dialog.open(UnacceptedCashflowDialogueComponent, {
        data: {
          entityOneName: row.entityOne.name,
          entityTwoName: row.entityTwo.name,
          documentReference: row.documentReference,
          currency: row.currency,
          originalValue: row.originalValue,
          reason: '',
        },
      });

      dialogRef.afterClosed().subscribe((data) => {
        // reset checkbox if cancelled
        if (data.isCancelled === true) {
          this.selection.select(row);
          return;
        }

        this.unacceptedCashflows.push({ id, message: data.reason });

        this.unacceptedCashflowsEvent.emit(this.unacceptedCashflows);
      });
    }
  }

  private handleChecked(matCheckboxChange: MatCheckboxChange, row: CashflowSummary): void {
    if (matCheckboxChange.checked === true) {
      const i = this.unacceptedCashflows.map((cf) => cf.id).indexOf(row.id);

      if (i !== -1) {
        this.unacceptedCashflows.splice(i, 1);

        this.unacceptedCashflowsEvent.emit(this.unacceptedCashflows);
      }
    }
  }

  public getTotalRate(cashflow: CashflowSummary): number {
    return (cashflow.annualisedMarginRate + cashflow.referenceRate) / 100;
  }
}
