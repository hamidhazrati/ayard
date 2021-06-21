import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SUMMARIES_EXCLUDED_STATES } from '@cashflows/services/origination-proposal.service';
import { CashflowDataService, CashflowSummariesParams } from '../../services/cashflow-data.service';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { LayoutService } from '@app/core/services/layout.service';
import { CashflowFile, CashflowStatusUpdate } from '../../models/cashflow-file';
import { Subject } from 'rxjs';
import { viewCashflowFileCrumb } from './view-cashflow-files.crumb';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CashflowSummary, Entity, CashflowContract } from '../../models';
import { MatDialog } from '@angular/material/dialog';
import { RejectCashflowDialogComponent } from './reject-cashflow-dialog/reject-cashflow-dialog.component';
import { OriginationProposalDialogComponent } from '@app/features/cashflows/components/view-cashflow-files/origination-proposal-dialog/origination-proposal-dialog.component';
import {
  NotCreated,
  Originated,
  Rejected,
  Submitted,
} from '@app/features/cashflows/models/cashflow-file-status';
import { CashflowService } from '@cashflows/services/cashflow.service';
import { AuthService } from '@app/auth/auth-service';

@Component({
  selector: 'app-view-cashflow-files',
  templateUrl: './view-cashflow-files.component.html',
  styleUrls: ['./view-cashflow-files.component.scss'],
})
export class ViewCashflowFilesComponent implements OnInit, OnDestroy {
  public cashflowFile: CashflowFile;
  public validCashflows: CashflowSummary[];
  public invalidCashflows: CashflowSummary[];
  public cashflowFailures: CashflowSummary[];
  public cashflowContracts: CashflowContract[];
  public uniqueSellers: Entity[];
  public loaded: boolean;
  private onDestroy$: Subject<void> = new Subject<void>();
  public hasCheckerAuthority = false;
  public isMakerOfTheCfFile;
  public invalidPermissionMsg: string = this.authService.invalidPermissionMsg;
  public canSubmitToOriginationProposal = false;
  busy = false;
  public allCashFlowSummaries: CashflowSummary[];

  constructor(
    private route: ActivatedRoute,
    private cashflowDataService: CashflowDataService,
    private cashflowService: CashflowService,
    private crumbService: CrumbService,
    private layoutService: LayoutService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.loaded = false;
  }

  ngOnInit(): void {
    this.layoutService.showBodyGrid(false);
    this.getCashflowFile();
  }

  ngOnDestroy(): void {
    this.layoutService.showBodyGrid(true);
    this.onDestroy$.next();
  }

  getCashflowFile(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.cashflowDataService
      .getCashflowFile(id)
      .pipe(take(1), takeUntil(this.onDestroy$)) // stop subscribing ngOnDestroy
      .subscribe((cfFile: CashflowFile) => {
        this.crumbService.setCrumbs(viewCashflowFileCrumb(cfFile));
        this.cashflowFile = cfFile;
        this.loaded = true;

        this.authService
          .isAuthorised('cashflow:approve')
          .then((isAuthorised) => (this.hasCheckerAuthority = isAuthorised));

        this.authService
          .isAuthorised('cashflow:write')
          .then((isAuthorised) => (this.canSubmitToOriginationProposal = isAuthorised));

        this.authService
          .getUserName()
          .then(
            (userName) => (this.isMakerOfTheCfFile = this.cashflowFile.uploadedBy === userName),
          );

        if (!this.cashflowFileStatusNotCreated()) {
          this.getCashflowSummary(cfFile.id);
        }
      });
  }

  cashflowTotal() {
    return this.cashflowFile?.cashflowTotals?.[0];
  }

  submitForProcessing(): void {
    this.busy = true;
    const cashflowFileId = this.cashflowFile?.id;

    const submitForProcessingPayload: CashflowStatusUpdate = {
      status: 'CASHFLOW_CREATION_START',
      message: '',
      user: 'ops-portal-user',
    };

    this.cashflowDataService
      .updateCashflowStatus(cashflowFileId, submitForProcessingPayload)
      .pipe(
        switchMap((fileIWithUpdatedStatus) => {
          return this.cashflowDataService.getCashflowFile(fileIWithUpdatedStatus.id);
        }),
      )
      .subscribe(
        (cfFile: CashflowFile) => {
          this.cashflowFile = cfFile;
          this.getCashflowSummary(cfFile.id);
          this.busy = false;
        },
        () => {
          console.error('Error while trying to process file : ', cashflowFileId);
          this.busy = false;
        },
      );
  }

  private getCashflowSummary(cashflowFileId: string) {
    const params: CashflowSummariesParams = {
      cashflowFileId,
      includeAllFailuresInFile: true,
    };
    this.cashflowDataService
      .getCashflowSummaries(params)
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe((cfSummaries: CashflowSummary[]) => {
        this.cashflowContracts = this.cashflowService.getCashflowContracts(cfSummaries);
        this.validCashflows = this.cashflowService.getValidCashflows(cfSummaries);
        this.invalidCashflows = this.cashflowService.getInvalidCashflows(cfSummaries);
        this.cashflowFailures = this.cashflowService.getCashflowFailures(cfSummaries);
        this.uniqueSellers = this.cashflowService.getUniqueSellers(cfSummaries);
        this.allCashFlowSummaries = cfSummaries;

        if (this.hasUnprocessedCashflows()) {
          setTimeout(() => this.getCashflowFile(), cfSummaries.length < 500 ? 5000 : 15000);
          return false;
        }
      });
  }

  /**
   * Check to see if any cashflows are in 'RECEIVED', 'VALIDATED' state
   */
  public hasUnprocessedCashflows(): boolean {
    if (!this.allCashFlowSummaries) {
      return true;
    }

    const cashFlowStates: string[] = this.allCashFlowSummaries.map(
      (item: CashflowSummary) => item.state,
    );

    return (
      cashFlowStates.includes(SUMMARIES_EXCLUDED_STATES[0]) ||
      cashFlowStates.includes(SUMMARIES_EXCLUDED_STATES[1])
    );
  }

  openRejectDialogue(): void {
    const dialogRef = this.dialog.open(RejectCashflowDialogComponent, {
      width: '350px',
      height: '310px',
      data: {
        cashflowFileId: this.cashflowFile.id,
      },
    });

    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        this.getCashflowFile();
      });
    }
  }

  openOriginationConfirmationDialogue(): void {
    const dialogRef = this.dialog.open(OriginationProposalDialogComponent, {
      width: '350px',
      height: '200px',
      data: {
        cashflowFile: this.cashflowFile,
      },
    });

    if (dialogRef) {
      dialogRef.afterClosed().subscribe((result) => {
        this.getCashflowFile();
      });
    }
  }

  cashflowFileStatusNotCreated(): boolean {
    return NotCreated[this.cashflowFile?.status] !== undefined;
  }

  cashflowsFileStatusRejected(): boolean {
    return Rejected[this.cashflowFile?.status] !== undefined;
  }

  cashflowFileStatusOriginated(): boolean {
    return Originated[this.cashflowFile?.status] !== undefined;
  }

  cashflowFileStatusSubmitted(): boolean {
    return Submitted[this.cashflowFile?.status] !== undefined;
  }

  public shouldDisableOriginationProposal(): boolean {
    return (
      !this.validCashflows?.length ||
      !this.canSubmitToOriginationProposal ||
      this.cashflowFile?.status === 'PENDING_CLIENT_VERIFICATION' ||
      this.hasUnprocessedCashflows()
    );
  }

  shouldDisableSubmit() {
    return (
      this.cashflowFile?.status !== 'END_PROCESSING' ||
      !this.hasCheckerAuthority ||
      this.isMakerOfTheCfFile ||
      this.busy
    );
  }

  shouldDisableReject() {
    if (this.cashflowFileStatusNotCreated()) {
      return this.shouldDisableSubmit();
    } else {
      return this.shouldDisableOriginationProposal();
    }
  }

  getCashflowsCount() {
    return (
      this.validCashflows?.length + this.invalidCashflows?.length + this.cashflowFailures?.length
    );
  }

  public validCashflowCount(): string {
    if (!this.hasUnprocessedCashflows()) {
      return `(${this.validCashflows?.length})`;
    }
  }

  public invalidAndFailedCashflowCount(): string {
    if (!this.hasUnprocessedCashflows()) {
      return `(${this.invalidCashflows?.length + this.cashflowFailures?.length})`;
    }
  }
}
