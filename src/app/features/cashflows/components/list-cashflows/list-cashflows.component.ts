import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { listCashflowsCrumb } from '@app/features/cashflows/components/list-cashflows/list-cashflows.crumb';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { Cashflow } from '@app/features/cashflows/models/cashflow';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-cashflows',
  templateUrl: './list-cashflows.component.html',
})
export class ListCashflowsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'externalReference',
    'certifiedAmount',
    'currency',
    'issueDate',
    'originalDueDate',
    'state',
  ];
  cashflows: Cashflow[];

  private cashflowSubscription$: Subscription;

  constructor(
    private cashflowDataService: CashflowDataService,
    private crumbService: CrumbService,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(listCashflowsCrumb());
    this.refresh();
  }

  refresh() {
    this.cashflowSubscription$ = this.cashflowDataService
      .getCashflows()
      .subscribe((data: Cashflow[]) => {
        this.cashflows = data;
      });
  }

  ngOnDestroy(): void {
    this.cashflowSubscription$.unsubscribe();
  }
}
