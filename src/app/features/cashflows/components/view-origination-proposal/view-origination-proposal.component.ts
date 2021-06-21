import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/auth/auth-service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { SpinnerOverlayService } from '@app/services/spinner-overlay/spinner-overlay.service';
import { InternalApprovalDialogComponent } from '@cashflows/components/view-origination-proposal/internal-approval-dialog/internal-approval-dialog.component';
import { CashflowDataService, RejectCashflow } from '@cashflows/services/cashflow-data.service';
import { OriginationProposalService } from '@cashflows/services/origination-proposal.service';
import { viewOriginationProposalCrumb } from '@app/features/cashflows/components/view-origination-proposal/view-origination-proposal.crumb';
import { filter, takeUntil } from 'rxjs/operators';
import { CashflowFile, CashflowStatusUpdate } from '@app/features/cashflows/models/cashflow-file';
import { Subject } from 'rxjs';
import { LayoutService } from '@app/core/services/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { CashflowTotal } from '@app/features/cashflows/models/cashflow-total';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CashflowSummary, Entity } from '../../models';
import { RejectCashflowDialogComponent } from '@app/features/cashflows/components/view-cashflow-files/reject-cashflow-dialog/reject-cashflow-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from '@app/features/cashflows/components/view-origination-proposal/export-dialog/export-dialog.component';
import { SubmitToTradeDialogComponent } from '@app/features/cashflows/components/view-origination-proposal/submit-to-trade-dialog/submit-to-trade-dialog.component';
import { CashflowService } from '@cashflows/services/cashflow.service';
import { ProposalCashflowsWithFacility } from '@cashflows/models/cashflow-summary';

@Component({
  selector: 'app-view-origination-proposal',
  templateUrl: './view-origination-proposal.component.html',
  styleUrls: ['./view-origination-proposal.component.scss'],
})
export class ViewOriginationProposalComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  form: FormGroup<VersionHistory>;
  public cashflowFile: CashflowFile;
  public cashflowTotals: CashflowTotal[];
  public tabCashflowTotal: CashflowTotal;
  public cashflowSummaries: CashflowSummary[];
  public proposalCashflowsWithFacilities: ProposalCashflowsWithFacility[];
  public tabProposalCashflowsWithFacilities: ProposalCashflowsWithFacility[];
  public tabInvalidAndRejectedCashflowSummaries: CashflowSummary[];
  public tabUniqueSellers: Entity[];
  public currency: string;
  public cashflowFileId: string;
  public contractId: string;
  public selectedTabIndex: number;
  public rejected: boolean;
  public disableAccept: boolean;
  public isBeingEditing: boolean;
  public isCancelled: boolean;
  public maxMaturityDate: string;
  public maxTenor: number;
  public hasOriginationWriteAccess = false;
  public invalidPermissionMsg: string = this.authService.invalidPermissionMsg;

  private unacceptedCashflows: RejectCashflow[];

  @ViewChild('tabGroup')
  tabGroup: MatTabGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crumbService: CrumbService,
    private cashflowDataService: CashflowDataService,
    private originationProposalService: OriginationProposalService,
    private cashflowService: CashflowService,
    private layoutService: LayoutService,
    private authService: AuthService,
    private spinnerOverlayService: SpinnerOverlayService,
    public dialog: MatDialog,
  ) {
    this.form = new FormGroup({
      version: new FormControl(null, Validators.required),
    });
    this.rejected = false;
    this.disableAccept = true;
    this.isBeingEditing = false;
    this.isCancelled = false;
    this.unacceptedCashflows = [];
  }

  ngOnInit(): void {
    this.subscribeToInternalApproval();
    this.layoutService.showBodyGrid(false);
    this.checkOriginationWriteAccess();
    this.listenToCashflowFileExport();

    this.setValuesFromURLOnInit();
    this.crumbService.setCrumbs(viewOriginationProposalCrumb(this.cashflowFileId));
    this.spinnerOverlayService.show();

    this.originationProposalService
      .getViewOriginationProposalData(this.cashflowFileId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cf) => {
        this.cashflowFile = cf.cashflowFile;
        this.rejected = this.cashflowFile.status === 'REJECTED';
        this.cashflowTotals = cf.cashflowTotals;
        this.cashflowSummaries = cf.cashflowSummaries;
        this.proposalCashflowsWithFacilities = this.originationProposalService.getCashflowSummariesWithFacilities(
          cf.cashflowSummaries,
          cf.cashflowFileFacilities,
        );
        this.setValuesForTab();
        this.spinnerOverlayService.hide();
      });
  }

  ngOnDestroy(): void {
    this.layoutService.showBodyGrid(true);
    this.onDestroy$.next();
  }

  public listenToCashflowFileExport(): void {
    this.cashflowDataService.isCashflowFileExported
      .pipe(filter(Boolean), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.cashflowDataService
          .getCashflowFile(this.cashflowFileId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((cashflowFile: CashflowFile) => {
            this.cashflowFile = cashflowFile;
          });
      });
  }

  public checkOriginationWriteAccess(): void {
    this.authService
      .isAuthorised('origination:write')
      .then((isAuthorised) => (this.hasOriginationWriteAccess = isAuthorised));
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currency = this.setCurrencyForTab(tabChangeEvent.index, this.cashflowTotals);
    this.contractId = this.setContractIdForTab(tabChangeEvent.index, this.cashflowTotals);
    this.setValuesForTab();
    this.updateDeepLinkWithoutPageLoading();
  }

  openRejectDialogue(): void {
    const dialogRef = this.dialog.open(RejectCashflowDialogComponent, {
      width: '350px',
      height: '310px',
      data: {
        cashflowFileId: this.cashflowFile.id,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.cashflowDataService
          .getCashflowFile(this.cashflowFileId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((cfFile: CashflowFile) => {
            this.cashflowFile = cfFile;
            this.rejected = this.cashflowFile.status === 'REJECTED';
          });
      });
  }

  editProposalTab(): void {
    this.isBeingEditing = true;
    this.isCancelled = false;
    this.disableAccept = false;
    this.tabGroup._allTabs.forEach((tab) => {
      tab.disabled = true;
    });
  }

  onUnacceptedCashflows(eventArgs: RejectCashflow[]): void {
    this.unacceptedCashflows = eventArgs;
  }

  saveEdits(): void {
    this.isBeingEditing = false;
    this.isCancelled = false;
    this.disableAccept = true;
    this.tabGroup._allTabs.forEach((tab) => {
      tab.disabled = false;
    });

    this.cashflowDataService
      .rejectCashflows(this.unacceptedCashflows)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.spinnerOverlayService.show();

        this.originationProposalService
          .getViewOriginationProposalData(this.cashflowFileId)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((cf) => {
            const tabIndex = this.getCurrentTabOrReset(cf.cashflowTotals);
            this.currency = this.setCurrencyForTab(tabIndex, cf.cashflowTotals);
            this.contractId = this.setContractIdForTab(tabIndex, cf.cashflowTotals);
            this.cashflowTotals = cf.cashflowTotals;
            this.cashflowSummaries = cf.cashflowSummaries;
            this.proposalCashflowsWithFacilities = this.originationProposalService.getCashflowSummariesWithFacilities(
              cf.cashflowSummaries,
              cf.cashflowFileFacilities,
            );
            this.setValuesForTab();
            this.updateDeepLinkWithoutPageLoading();
            this.spinnerOverlayService.hide();
          });
      });
  }

  cancelEdits(): void {
    this.isBeingEditing = false;
    this.isCancelled = true;
    this.disableAccept = true;
    this.tabGroup._allTabs.forEach((tab) => {
      tab.disabled = false;
    });
  }

  displayEditButton(): boolean {
    return this.cashflowFile?.status === 'AWAITING_INTERNAL_APPROVAL' && !this.isBeingEditing;
  }

  displayExportButton(): boolean {
    return (
      (this.cashflowFile?.status === 'START_ORIGINATION' ||
        this.cashflowFile?.status === 'AWAITING_CLIENT_APPROVAL') &&
      !this.isBeingEditing
    );
  }

  displayGrantInternalApprovalButton(): boolean {
    return this.cashflowFile?.status === 'AWAITING_INTERNAL_APPROVAL' && !this.isBeingEditing;
  }

  displaySubmitToTradeButton(cashflowFile: CashflowFile): boolean {
    return (
      (cashflowFile?.status === 'PENDING_CLIENT_VERIFICATION' ||
        cashflowFile?.status === 'AWAITING_CLIENT_APPROVAL') &&
      !this.isBeingEditing
    );
  }

  displayRejectButton(): boolean {
    return (
      ((this.rejected === false && this.cashflowFile?.status === 'AWAITING_INTERNAL_APPROVAL') ||
        this.cashflowFile?.status === 'START_ORIGINATION' ||
        this.cashflowFile?.status === 'PENDING_CLIENT_VERIFICATION') &&
      !this.isBeingEditing
    );
  }

  public openInternalApprovalDialogue(): void {
    this.dialog.open(InternalApprovalDialogComponent);
  }

  public subscribeToInternalApproval() {
    this.cashflowService.internalApproval$
      .pipe(filter(Boolean), takeUntil(this.onDestroy$))
      .subscribe(() => {
        const processingStatus: CashflowStatusUpdate = {
          status: 'START_ORIGINATION',
        } as CashflowStatusUpdate;

        this.cashflowDataService
          .updateCashflowStatus(this.cashflowFile.id, processingStatus)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((cashflowFile: CashflowFile) => {
            this.cashflowFile = cashflowFile;
          });
      });
  }

  openSubmitToTradeDialogue(): void {
    const dialogRef = this.dialog.open(SubmitToTradeDialogComponent, {
      width: '350px',
      data: {
        cashflowFile: this.cashflowFile,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.cashflowFile = result;
      });
  }

  openExportDialogue(): void {
    this.dialog.open(ExportDialogComponent, {
      data: {
        cashflowFileId: this.cashflowFile.id,
      },
    });
  }

  getAcceptedCashflowsCount(): number {
    return this.tabProposalCashflowsWithFacilities
      .map((pc) => pc.noOfCashflows)
      .reduce((count, currentValue) => count + currentValue, 0);
  }

  getFirstValidCashflow(): CashflowSummary {
    return this.tabProposalCashflowsWithFacilities.flatMap((pcf) => pcf.cashflows)[0];
  }

  getInvalidTabTitle(): string {
    return this.cashflowFile.status === 'SUBMITTED_TO_TRADE'
      ? 'Rejected Cashflows'
      : 'Invalid Cashflows';
  }

  getValidTabTitle(): string {
    return this.cashflowFile.status === 'SUBMITTED_TO_TRADE'
      ? 'Accepted Cashflows'
      : 'Valid Cashflows';
  }

  /*
   * Private functions
   */
  private setValuesFromURLOnInit(): void {
    this.cashflowFileId = this.route.snapshot.paramMap.get('id');
    this.currency = this.route.snapshot.queryParamMap.get('currency');
    this.contractId = this.route.snapshot.queryParamMap.get('contractId');
  }

  private setValuesForTab(): void {
    this.tabCashflowTotal = this.originationProposalService.getCashflowTotalForCurrencyAndContract(
      this.cashflowTotals,
      this.currency,
      this.contractId,
    );
    this.selectedTabIndex = this.cashflowTotals.indexOf(this.tabCashflowTotal);
    this.tabProposalCashflowsWithFacilities = this.originationProposalService.getProposalCashflowsWithFacilitiesForCurrencyAndContract(
      this.proposalCashflowsWithFacilities,
      this.currency,
      this.contractId,
    );
    this.tabInvalidAndRejectedCashflowSummaries = this.originationProposalService.getInvalidCashflowsForTab(
      this.cashflowSummaries,
    );
    this.tabUniqueSellers = this.originationProposalService.getUniqueSellersForTab(
      this.cashflowSummaries,
      this.currency,
      this.contractId,
    );
    this.maxMaturityDate = this.originationProposalService.getMaxMaturityDateForTab(
      this.cashflowSummaries,
      this.currency,
      this.contractId,
    );
    this.maxTenor = this.originationProposalService.getMaxTenor(
      this.cashflowSummaries,
      this.maxMaturityDate,
    );
  }

  private getCurrentTabOrReset(cashflowTotals: CashflowTotal[]): number {
    const currentTabIndex = cashflowTotals?.findIndex(
      (cf: CashflowTotal) => this.currency === cf.currency && this.contractId === cf.contractId,
    );

    if (currentTabIndex === -1) return 0;

    return currentTabIndex;
  }

  private setCurrencyForTab(index: number, cashflowTotals: CashflowTotal[]): string {
    let currency = '';
    try {
      currency = cashflowTotals[index].currency;

      return currency;
    } catch (error) {
      return currency;
    }
  }

  private setContractIdForTab(index: number, cashflowTotals: CashflowTotal[]): string {
    let contractId = '';
    try {
      contractId = cashflowTotals[index].contractId;

      return contractId;
    } catch (error) {
      return contractId;
    }
  }

  private updateDeepLinkWithoutPageLoading(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { contractId: this.contractId, currency: this.currency },
      queryParamsHandling: 'merge',
    });
  }
}

export interface VersionHistory {
  version: string;
}
