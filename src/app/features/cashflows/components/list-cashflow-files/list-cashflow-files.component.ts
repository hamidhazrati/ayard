import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth-service';
import { LayoutService } from '@app/core/services/layout.service';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Page, PageRequestFactory } from '@app/shared/pagination';
import { PaginationMeta } from '@app/shared/pagination/model/Pagination';
import { CashflowFile } from '@cashflows/models';
import {
  GdsCellAlign,
  GdsColumn,
  GdsColumnType,
  GdsPaginationEvent,
  GdsPaginationMeta,
  GdsSortEvent,
  SortDirection,
} from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { CashflowDataService } from '../../services/cashflow-data.service';
import { listCashflowFilesCrumb } from './list-cashflow-files.crumb';
import { UploadCashflowDialogComponent } from './upload-cashflow-dialog/upload-cashflow-dialog.component';

@Component({
  selector: 'app-list-cashflow-files',
  templateUrl: './list-cashflow-files.component.html',
})
export class ListCashflowFilesComponent implements OnInit, OnDestroy {
  private pageSize: number;
  public sorting: GdsSorting;
  public paginationMeta: GdsPaginationMeta = PaginationMeta;
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'uploadDate',
      dir: SortDirection.desc,
    },
  ];
  public rows: any = [];
  public columns: GdsColumn[] = [
    { prop: 'clientName', columnWidth: 200 },
    { prop: 'id', name: 'Cashflow File Id', columnWidth: 300 },
    { prop: 'uploadDate', type: GdsColumnType.DateTime, columnWidth: 400 },
    { prop: 'filename', name: 'Cashflow File Name', columnWidth: 650 },
    { prop: 'uploadedBy', columnWidth: 300 },
    {
      prop: 'cashflowRowCount',
      cellAlign: GdsCellAlign.Right,
      name: 'No Of Cashflows',
      columnWidth: 200,
    },
    { prop: 'status', type: GdsColumnType.TitleCase, columnWidth: 400 },
  ];

  public hasMakerClaim = false;
  public isFetchingCounterParties = false;
  private cashflowSubscription$: Subscription;

  constructor(
    private authService: AuthService,
    private cashflowDataService: CashflowDataService,
    private contractService: ContractService,
    private crumbservice: CrumbService,
    private dialog: MatDialog,
    private layoutService: LayoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.layoutService.showBodyGrid(false);
    this.crumbservice.setCrumbs(listCashflowFilesCrumb());
    this.getCashflowFiles();
    this.authService
      .isAuthorised('cashflow:write')
      .then((hasAuthority) => (this.hasMakerClaim = hasAuthority));
  }

  public sort(event: GdsSortEvent): void {
    this.sorting = event.sorts[0];
    return this.getCashflowFiles();
  }

  public getCashflowFiles(event?: GdsPaginationEvent) {
    // GdsPaginationEvent is not fired on a column sort
    // so any changes to pageSize on the ui are lost when sorting
    // cache pageSize so previously set value is not lost
    if (event) {
      this.pageSize = event.pageSize;
    }

    const params: HttpParams = new PageRequestFactory().createHttpParams(
      {
        ...event,
        ...(this.pageSize && { pageSize: this.pageSize }),
      },
      this.sorting || this.defaultSorts[0],
    );

    this.cashflowSubscription$ = this.cashflowDataService
      .getCashflowFiles(params)
      .pipe(take(1))
      .subscribe((page: Page<CashflowFile>) => {
        this.rows = page.data;
        this.paginationMeta = Object.assign(this.paginationMeta, { ...page.meta.paged });
      });
  }

  public openFileUploadDialogue(): void {
    this.isFetchingCounterParties = true;

    this.contractService
      .getSellerCounterparties()
      .pipe(
        take(1),
        finalize(() => (this.isFetchingCounterParties = false)),
      )
      .subscribe((response: string[]) => {
        const dialogRef = this.dialog.open(UploadCashflowDialogComponent, {
          data: {
            clients: response.sort(),
          },
        });
        dialogRef
          .afterClosed()
          .pipe(take(1))
          .subscribe(() => this.getCashflowFiles());
      });
  }

  public onRowClick(event: any): Promise<boolean> {
    return this.router.navigate(['/cashflows/files', event.id]);
  }

  ngOnDestroy(): void {
    this.layoutService.showBodyGrid(true);
    this.cashflowSubscription$.unsubscribe();
  }
}
