import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { SpinnerOverlayService } from '@app/services/spinner-overlay/spinner-overlay.service';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';

import { Subscription } from 'rxjs';
import { CashflowTotal } from '@app/features/cashflows/models/cashflow-total';
import { listOriginationProposalsCrumb } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.crumb';

@Component({
  selector: 'app-list-origination-proposals',
  templateUrl: './list-origination-proposals.component.html',
})
export class ListOriginationProposalsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'clientName',
    'cashflowFileId',
    'contractName',
    'acceptanceDate',
    'currency',
    'totalOriginalValue',
    'totalInitialFundingAmount',
    'contractAdvanceRate',
    'totalDiscountAmount',
    'contractSpread',
    'totalPaymentAmount',
    'status',
  ];
  cashflowTotals: CashflowTotal[];

  private cashflowSubscription$: Subscription;

  constructor(
    private cashflowDataService: CashflowDataService,
    private crumbService: CrumbService,
    private spinnerOverlayService: SpinnerOverlayService,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(listOriginationProposalsCrumb());
    this.spinnerOverlayService.show();
    this.refresh();
  }

  refresh() {
    this.cashflowSubscription$ = this.cashflowDataService
      .getCashflowTotals([
        'INVALID',
        'REJECTED',
        'RECEIVED',
        'VALIDATED',
        'CASHFLOW_PROCESSING_ERROR',
      ])
      .subscribe((data: CashflowTotal[]) => {
        this.cashflowTotals = data;
        this.spinnerOverlayService.hide();
      });
  }

  ngOnDestroy(): void {
    this.cashflowSubscription$.unsubscribe();
  }
}
