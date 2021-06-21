import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/auth/auth-service';
import { SpinnerOverlayService } from '@app/services/spinner-overlay/spinner-overlay.service';
import { CashflowService } from '@cashflows/services/cashflow.service';
import { ViewOriginationProposalComponent } from './view-origination-proposal.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockService } from 'ng-mocks';
import {
  CASHFLOW_FILE_FACILITY,
  CASHFLOW_TOTALS,
  CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL,
  CASHFLOWFILE_IN_START_ORIGINATION,
  CASHFLOWS,
} from '@cashflows/components/view-origination-proposal/view-origination-proposal.component.test-data-source';
import {
  EXPECTED_SELLERS,
  PROPOSAL_CASHFLOWS_WITH_FACILITIES,
  TAB_PROPOSAL_CASHFLOWS_WITH_FACILITIES,
  PROPOSAL_CASHFLOWS_WITH_FACILITIES_WHEN_NO_FACILITIES,
  TAB_REJECTED_CASHFLOWS,
} from '@cashflows/components/view-origination-proposal/view-origination-proposal.component.test-data-expected';
import { BehaviorSubject, of } from 'rxjs';
import { viewOriginationProposalCrumb } from '@app/features/cashflows/components/view-origination-proposal/view-origination-proposal.crumb';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ProposalTableComponent } from '@app/features/cashflows/components/view-origination-proposal/proposal-table/proposal-table.component';
import { MatDialog } from '@angular/material/dialog';
import { InvalidCashflowsProposalTableComponent } from '@app/features/cashflows/components/view-origination-proposal/invalid-cashflows-proposal-table/invalid-cashflows-proposal-table.component';
import {
  CASHFLOW_UTLITIES_CONFIG,
  CashflowConfigService,
} from '@cashflows/services/cashflow-config.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrdinalFormatPipe } from '@app/features/cashflows/components/view-origination-proposal/ordinal-format.pipe';
import moment from 'moment';
import Mocked = jest.Mocked;
import { TitleCaseFormatPipe } from '@app/shared/pipe/titlecase-format.pipe';

describe('ViewOriginationProposalComponent', () => {
  let component: ViewOriginationProposalComponent;
  let fixture: ComponentFixture<ViewOriginationProposalComponent>;
  let crumbService: Mocked<CrumbService>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let matDialog: Mocked<MatDialog>;
  let mockAuthService: Mocked<AuthService>;
  let mockSpinnerOverlayService: Mocked<SpinnerOverlayService>;
  let cashflowService: CashflowService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewOriginationProposalComponent,
        ProposalTableComponent,
        InvalidCashflowsProposalTableComponent,
        OrdinalFormatPipe,
        TitleCaseFormatPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatTabsModule,
        MatDividerModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatCheckboxModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ currency: 'USD', contractId: 'the-contract-id1' }),
              paramMap: convertToParamMap({ id: CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id }),
            },
          },
        },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: SpinnerOverlayService,
          useValue: mockSpinnerOverlayService = MockService(SpinnerOverlayService) as Mocked<
            SpinnerOverlayService
          >,
        },
        {
          provide: CashflowDataService,
          useValue: cashflowDataService = MockService(CashflowDataService) as Mocked<
            CashflowDataService
          >,
        },
        { provide: MatDialog, useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog> },
        { provide: CASHFLOW_UTLITIES_CONFIG, useValue: CashflowConfigService },
        HttpClientTestingModule,
      ],
    }).compileComponents();

    mockAuthService.isAuthorised.mockReturnValue(
      new Promise((resolve, reject) => {
        return resolve(true);
      }),
    );

    cashflowDataService.isCashflowFileExported = new BehaviorSubject<boolean>(null);

    fixture = TestBed.createComponent(ViewOriginationProposalComponent);
    component = fixture.componentInstance;
    cashflowService = TestBed.inject(CashflowService);
  }));

  describe('GIVEN logged in user does not have `origination:write` access', () => {
    beforeEach(() => {
      component.tabProposalCashflowsWithFacilities = [];
      cashflowDataService.getCashflowFile.mockReturnValue(of(CASHFLOWFILE_IN_START_ORIGINATION));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );
      mockAuthService.isAuthorised = jest
        .fn()
        .mockImplementation((claim) => Promise.resolve(claim !== 'origination:write'));
      component.displayEditButton = () => true;
      component.displayExportButton = () => true;
      component.displayGrantInternalApprovalButton = () => true;
      component.displaySubmitToTradeButton = () => true;
      component.displayRejectButton = () => true;
      fixture.detectChanges();
    });

    test('THEN the origination proposal action buttons should be disabled', () => {
      fixture.detectChanges();

      const editButton = fixture.nativeElement.querySelector('[data-testid="edit"]');
      expect(editButton.disabled).toEqual(true);

      const exportButton = fixture.nativeElement.querySelector('[data-testid="export"]');
      expect(exportButton.disabled).toEqual(true);

      const rejectButton = fixture.nativeElement.querySelector('[data-testid="reject"]');
      expect(rejectButton.disabled).toEqual(true);

      const submitToTradeButton = fixture.nativeElement.querySelector(
        '[data-testid="submit-to-trade"]',
      );
      expect(submitToTradeButton.disabled).toEqual(true);

      const grantApprovalButton = fixture.nativeElement.querySelector(
        '[data-testid="grant-approval"]',
      );
      expect(grantApprovalButton.disabled).toEqual(true);
    });
  });

  describe('GIVEN view origination proposal component is initialised', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );
      fixture.detectChanges();
    });

    test('THEN the cashflow file exported listener is setup', () => {
      spyOn(cashflowDataService.isCashflowFileExported, 'subscribe');

      cashflowDataService.isCashflowFileExported.next(true);
      component.listenToCashflowFileExport();
      expect(cashflowDataService.isCashflowFileExported.subscribe).toHaveBeenCalled();
    });

    test('THEN the cashflow file is retrieved once the cashflow file is exported', () => {
      spyOn(cashflowDataService, 'getCashflowFile').and.callThrough();

      cashflowDataService.isCashflowFileExported.next(true);
      expect(cashflowDataService.getCashflowFile).toHaveBeenCalled();
    });
  });

  /*
  Note that tests relating to the different origination proposal status' are in the cypress tests
 */
  describe('GIVEN view origination proposal component is initialised with all the data and cashflow file is in AWAITING_INTERNAL_APPROVAL status.', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );
      fixture.detectChanges();
    });

    test('THEN the spinner should be called', () => {
      expect(mockSpinnerOverlayService.show).toHaveBeenCalled();
    });

    test('THEN the crumbservice should be called', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(
        viewOriginationProposalCrumb(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id),
      );
    });

    test('THEN the class variables are set correctly', () => {
      expect(component.cashflowFileId).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id);
      expect(component.cashflowFile).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL);
      expect(component.currency).toEqual('USD');
      expect(component.contractId).toEqual('the-contract-id1');
      expect(component.cashflowSummaries).toEqual(CASHFLOWS);
      expect(component.proposalCashflowsWithFacilities).toEqual(PROPOSAL_CASHFLOWS_WITH_FACILITIES);
      expect(component.tabProposalCashflowsWithFacilities).toEqual(
        TAB_PROPOSAL_CASHFLOWS_WITH_FACILITIES,
      );
      expect(component.tabInvalidAndRejectedCashflowSummaries).toEqual(TAB_REJECTED_CASHFLOWS);
      expect(component.cashflowTotals).toEqual(CASHFLOW_TOTALS);
      expect(component.cashflowTotals.length).toEqual(2);
      expect(component.tabCashflowTotal.currency).toEqual('USD');
      expect(component.selectedTabIndex).toEqual(1);
      expect(component.tabUniqueSellers).toEqual(EXPECTED_SELLERS);
      expect(component.disableAccept).toEqual(true);
      expect(component.isBeingEditing).toEqual(false);
      expect(component.isCancelled).toEqual(false);
    });

    test('THEN receiving the `internalApproval$` event button will result in calling endpoint for status change to START_ORIGINATION and also component.cashflowFile will be updated accordingly', () => {
      cashflowService.internalApproval$.next(true);
      fixture.detectChanges();
      expect(cashflowDataService.updateCashflowStatus).toHaveBeenCalledWith(
        CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id,
        {
          status: 'START_ORIGINATION',
        },
      );
      expect(component.cashflowFile).toEqual(CASHFLOWFILE_IN_START_ORIGINATION);
    });
    test('THEN "maxMaturityDate" is set to the oldest maturity date', () => {
      const oldestDate = CASHFLOWS.map((cf) => cf.maturityDate)
        .sort()
        .reverse()[0];

      expect(component.maxMaturityDate).toEqual(oldestDate);
    });

    test('THEN "maxTenor" is between maxMaturityDate and acceptanceDate', () => {
      const maturityDate = moment(component.maxMaturityDate);
      const acceptanceDate = moment(component.getFirstValidCashflow().acceptanceDate);

      const maxTenor = Math.abs(maturityDate.diff(acceptanceDate, 'days'));
      expect(component.maxTenor).toEqual(maxTenor);
    });
  });

  describe('GIVEN I want to edit an origination proposal', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );
      fixture.detectChanges();
    });

    test('THEN editing the Proposal will change the status flags', () => {
      expect(component.disableAccept).toEqual(true);
      expect(component.isBeingEditing).toEqual(false);
      expect(component.isCancelled).toEqual(false);

      component.editProposalTab();

      expect(component.disableAccept).toEqual(false);
      expect(component.isBeingEditing).toEqual(true);
      expect(component.isCancelled).toEqual(false);
    });

    test('THEN saving edits will change the status flags', () => {
      cashflowDataService.rejectCashflows.mockReturnValue(of(CASHFLOWS));

      component.editProposalTab();

      component.saveEdits();

      expect(component.disableAccept).toEqual(true);
      expect(component.isBeingEditing).toEqual(false);
      expect(component.isCancelled).toEqual(false);
    });

    test('THEN saving edits will call the reject service correctly', () => {
      cashflowDataService.rejectCashflows.mockReturnValue(of(CASHFLOWS));

      component.onUnacceptedCashflows([
        { id: 'abc-123', message: 'message one' },
        { id: 'def-456', message: 'message two' },
      ]);

      component.saveEdits();

      expect(cashflowDataService.rejectCashflows).toHaveBeenCalledTimes(1);
      expect(cashflowDataService.rejectCashflows).toBeCalledWith([
        { id: 'abc-123', message: 'message one' },
        { id: 'def-456', message: 'message two' },
      ]);
    });

    test('THEN cancelling editing will change the status flags', () => {
      component.editProposalTab();

      component.cancelEdits();

      expect(component.disableAccept).toEqual(true);
      expect(component.isBeingEditing).toEqual(false);
      expect(component.isCancelled).toEqual(true);

      expect(cashflowDataService.rejectCashflows).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN there are no cashflow totals', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of([]));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      fixture.detectChanges();
    });
    test('THEN the class variables are set correctly', () => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of([]));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      fixture.detectChanges();

      expect(component.cashflowFileId).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id);
      expect(component.cashflowFile).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL);
      expect(component.currency).toEqual('USD');
      expect(component.contractId).toEqual('the-contract-id1');
      expect(component.cashflowSummaries).toEqual(CASHFLOWS);
      expect(component.proposalCashflowsWithFacilities).toEqual(PROPOSAL_CASHFLOWS_WITH_FACILITIES);
      expect(component.cashflowTotals).toEqual([]);
      expect(component.cashflowTotals.length).toEqual(0);
      expect(component.selectedTabIndex).toEqual(-1);
    });
  });

  describe('GIVEN there are no cashflow summaries', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of([]));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      fixture.detectChanges();
    });
    test('THEN the class variables are set correctly', () => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of([]));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of(CASHFLOW_FILE_FACILITY));
      fixture.detectChanges();

      expect(component.cashflowFileId).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id);
      expect(component.cashflowFile).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL);
      expect(component.currency).toEqual('USD');
      expect(component.contractId).toEqual('the-contract-id1');
      expect(component.cashflowSummaries).toEqual([]);
      expect(component.proposalCashflowsWithFacilities).toEqual([]);
      expect(component.cashflowTotals).toEqual(CASHFLOW_TOTALS);
      expect(component.cashflowTotals.length).toEqual(2);
      expect(component.tabCashflowTotal.currency).toEqual('USD');
      expect(component.selectedTabIndex).toEqual(1);
    });
  });

  describe('GIVEN there are no cashflow facilities', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of([]));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );
      fixture.detectChanges();
    });
    test('THEN the class variables are set correctly', () => {
      expect(component.cashflowFileId).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL.id);
      expect(component.cashflowFile).toEqual(CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL);
      expect(component.currency).toEqual('USD');
      expect(component.contractId).toEqual('the-contract-id1');
      expect(component.cashflowSummaries).toEqual(CASHFLOWS);
      expect(component.proposalCashflowsWithFacilities).toEqual(
        PROPOSAL_CASHFLOWS_WITH_FACILITIES_WHEN_NO_FACILITIES,
      );
      expect(component.cashflowTotals).toEqual(CASHFLOW_TOTALS);
      expect(component.cashflowTotals.length).toEqual(2);
      expect(component.tabCashflowTotal.currency).toEqual('USD');
      expect(component.selectedTabIndex).toEqual(1);
    });
  });

  describe('GIVEN the cashflow status is "submitted_to_trade"', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(
        of({
          ...CASHFLOWFILE_IN_AWAITING_INTERNAL_APPROVAL,
          status: 'SUBMITTED_TO_TRADE',
        }),
      );
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(CASHFLOWS));
      cashflowDataService.getCashflowTotalsByCashflowFileId.mockReturnValue(of(CASHFLOW_TOTALS));
      cashflowDataService.getFacilitiesForCashflowFile.mockReturnValue(of([]));
      cashflowDataService.updateCashflowStatus.mockReturnValue(
        of(CASHFLOWFILE_IN_START_ORIGINATION),
      );

      fixture.detectChanges();
    });

    test('THEN is should show the valid tab as Accepted Cashflows', () => {
      expect(component.getValidTabTitle()).toEqual('Accepted Cashflows');
    });

    test('THEN is should show the invalid tab as Rejected Cashflows', () => {
      expect(component.getInvalidTabTitle()).toEqual('Rejected Cashflows');
    });
  });
});
