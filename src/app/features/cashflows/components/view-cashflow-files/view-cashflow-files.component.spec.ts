import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ViewCashflowFilesComponent } from './view-cashflow-files.component';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { CashflowDataService } from '../../services/cashflow-data.service';
import { MockService } from 'ng-mocks';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { viewCashflowFileCrumb } from './view-cashflow-files.crumb';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { CashflowsTableComponent } from './cashflows-table/cashflows-table.component';
import { MatTableModule } from '@angular/material/table';
import { InvalidCashflowsTableComponent } from './invalid-cashflows-table/invalid-cashflows-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getByTestId } from '@app/shared/utils/test';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  cashflowfile,
  cashflowfileRejected,
  cashflowfileWithFailures,
  cashflowfileWithTotals,
  cashflows,
  invalidCashflows,
  cashflowFailures,
  validCashflows,
} from './view-cashflow-files.component.test-data';
import { MatDialog } from '@angular/material/dialog';
import { CashflowService } from '@cashflows/services/cashflow.service';
import Mocked = jest.Mocked;
import { AuthService } from '@app/auth/auth-service';
import { TitleCaseFormatPipe } from '@app/shared/pipe/titlecase-format.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

const ID = 'b1e400e5-a512-437e-8cf1-422bc083b175';

describe('ViewCashflowFilesComponent', () => {
  let component: ViewCashflowFilesComponent;
  let fixture: ComponentFixture<ViewCashflowFilesComponent>;
  let crumbService: Mocked<CrumbService>;
  let cashflowDataService: Mocked<CashflowDataService>;
  let cashflowService: Mocked<CashflowService>;
  let matDialog: Mocked<MatDialog>;
  let mockAuthService: Mocked<AuthService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewCashflowFilesComponent,
        CashflowsTableComponent,
        InvalidCashflowsTableComponent,
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
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ID }) } },
        },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        {
          provide: CashflowDataService,
          useValue: cashflowDataService = MockService(CashflowDataService) as Mocked<
            CashflowDataService
          >,
        },
        {
          provide: CashflowService,
          useValue: cashflowService = MockService(CashflowService) as Mocked<CashflowService>,
        },
        { provide: MatDialog, useValue: matDialog = MockService(MatDialog) as Mocked<MatDialog> },
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCashflowFilesComponent);
    component = fixture.componentInstance;

    mockAuthService.isAuthorised.mockReturnValue(
      new Promise((resolve, reject) => {
        return resolve(true);
      }),
    );

    mockAuthService.getUserName.mockReturnValue(
      new Promise((resolve, reject) => {
        return resolve('robin');
      }),
    );
  }));

  describe('GIVEN Cashflow component is initialised with cfFile status as CASHFLOW_CREATION_END', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfileWithTotals));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));
      cashflowService.getValidCashflows.mockReturnValue(validCashflows);
      cashflowService.getInvalidCashflows.mockReturnValue(invalidCashflows);
      cashflowService.getCashflowFailures.mockReturnValue(cashflowFailures);
      cashflowService.getUniqueSellers.mockReturnValue([
        cashflows[0].entityTwo,
        cashflows[2].entityOne,
        cashflows[4].entityOne,
      ]);
      cashflowService.getCashflowContracts.mockReturnValue([
        {
          id: 'the-contract-id1',
          name: 'the contract name',
        },
        {
          id: 'the-contract-id2',
          name: 'the second contract name',
        },
      ]);

      component.ngOnInit();
      fixture.detectChanges();
    });

    test('THEN the crumbservice should be called', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(
        viewCashflowFileCrumb(cashflowfileWithTotals),
      );
    });

    test('THEN the cashflowFile should be set', () => {
      expect(component.cashflowFile.id).toEqual(cashflowfileWithTotals.id);
      expect(component.cashflowFile.clientName).toEqual(cashflowfileWithTotals.clientName);
      expect(component.cashflowFile.filename).toEqual(cashflowfileWithTotals.filename);
      expect(component.cashflowFile.uploadDate).toEqual(cashflowfileWithTotals.uploadDate);
      expect(component.cashflowFile.uploadedBy).toEqual(cashflowfileWithTotals.uploadedBy);
      expect(component.cashflowFile.status).toEqual(cashflowfileWithTotals.status);
      expect(component.cashflowFile.cashflowRowCount).toEqual(
        cashflowfileWithTotals.cashflowRowCount,
      );
      expect(component.cashflowFile.cashflowTotals.length).toEqual(2);
      expect(component.cashflowFile.cashflowTotals[0].currency).toEqual('GBP');
      expect(component.cashflowFile.processingFailureMessages).toEqual(
        cashflowfileWithTotals.processingFailureMessages,
      );
      expect(component.cashflowFile.rejectionDetail).toEqual(
        cashflowfileWithTotals.rejectionDetail,
      );
    });

    test('THEN the valid cashflows should be set', () => {
      expect(component.validCashflows.length).toEqual(2);
      expect(component.validCashflows[0].id).toEqual('abc-1');
      expect(component.validCashflows[1].id).toEqual('abc-2');
    });

    test('THEN the invalid cashflows should be set', () => {
      expect(component.invalidCashflows.length).toEqual(1);
      expect(component.invalidCashflows[0].id).toEqual('abc-3');
    });

    test('THEN the cashflow Failures should be set', () => {
      expect(component.cashflowFailures.length).toEqual(4);
      expect(component.cashflowFailures[0].id).toEqual('abc-4');
      expect(component.cashflowFailures[1].id).toEqual('abc-5');
      expect(component.cashflowFailures[2].id).toEqual('abc-6');
      expect(component.cashflowFailures[3].id).toEqual('abc-7');
    });

    test('THEN the cashflowContract should be set', () => {
      expect(component.cashflowContracts.length).toEqual(2);
      expect(component.cashflowContracts[0].id).toEqual('the-contract-id1');
      expect(component.cashflowContracts[0].name).toEqual('the contract name');
      expect(component.cashflowContracts[1].id).toEqual('the-contract-id2');
      expect(component.cashflowContracts[1].name).toEqual('the second contract name');
    });

    test('THEN the uniqueSellers should be set', () => {
      expect(component.uniqueSellers.length).toEqual(3);
      expect(component.uniqueSellers[0]).toEqual(cashflows[0].entityTwo);
      expect(component.uniqueSellers[1]).toEqual(cashflows[2].entityOne);
      expect(component.uniqueSellers[2]).toEqual(cashflows[4].entityOne);
    });

    test('THEN I cant open the reject dialogue window', async () => {
      const rejectButton = fixture.nativeElement.querySelector('[data-testid="reject"]');
      fixture.detectChanges();
      expect(rejectButton.disabled).toEqual(false);
      rejectButton.click();
      expect(matDialog.open).toHaveBeenCalled();
    });

    test('THEN the invalid cashflows failure messages are not changed when set', () => {
      expect(component.invalidCashflows[0].reasonForFailure.length).toEqual(2);
      expect(component.invalidCashflows[0].reasonForFailure[0].code).toEqual('SINGLE_SUPPLIER');
      expect(component.invalidCashflows[0].reasonForFailure[0].message).toEqual(
        'Must be one and only one supplier on the cashflow',
      );
      expect(component.invalidCashflows[0].reasonForFailure[1].code).toEqual(
        'SUPPLIER_NOT_ON_CONTRACT',
      );
      expect(component.invalidCashflows[0].reasonForFailure[1].message).toEqual(
        'The SUPPLIER is not on the Contract',
      );
    });

    test('THEN REJECTED details should not be visible', () => {
      const rejectedHeader = fixture.nativeElement.querySelector('[data-testid="reject-header"]');
      const rejectUserTime = fixture.nativeElement.querySelector(
        '[data-testid="reject-user-time"]',
      );
      const rejectMessage = fixture.nativeElement.querySelector('[data-testid="reject-message"]');
      expect(rejectedHeader).toBeFalsy();
      expect(rejectUserTime).toBeFalsy();
      expect(rejectMessage).toBeFalsy();
    });
  });

  describe('GIVEN Cashflow component is initialised', () => {
    describe('WHEN the cashflow files have no totals', () => {
      beforeEach(() => {
        cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfile));
        cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));

        component.ngOnInit();
        fixture.detectChanges();
      });

      test('THEN the cashflowFile should be set OK', () => {
        expect(component.cashflowFile).toEqual(cashflowfile);
        expect(component.cashflowFile.cashflowTotals.length).toEqual(0);
      });
    });
  });

  describe('GIVEN Cashflow has state PENDING_CLIENT_VERIFICATION', () => {
    beforeEach(() => {
      const cashflow = Object.assign({}, cashflowfileWithTotals, {
        status: 'PENDING_CLIENT_VERIFICATION',
      });
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflow));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));
      cashflowService.getValidCashflows.mockReturnValue(validCashflows);

      mockAuthService.isAuthorised.mockReturnValue(
        new Promise((resolve, reject) => {
          return resolve(true);
        }),
      );

      component.ngOnInit();
      component.canSubmitToOriginationProposal = true;
      fixture.detectChanges();
    });

    test('THEN the submit for processing button should be disabled', () => {
      const submitButton: DebugElement = getByTestId(fixture, 'submit-proposal');
      expect(submitButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('GIVEN Cashflow component is initialised in CASHFLOW_CREATION_END state', () => {
    beforeEach(() => {
      const cashflow = Object.assign({}, cashflowfile);
      cashflow.status = 'CASHFLOW_CREATION_END';
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflow));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));

      component.ngOnInit();
      fixture.detectChanges();
    });

    test('THEN the submit for processing button should be hidden', () => {
      expect(getByTestId(fixture, 'submit-processing')).toBeNull();
    });

    test('THEN the submit for origination button should be visible', () => {
      expect(getByTestId(fixture, 'submit-proposal')).toBeTruthy();
    });
  });

  describe('GIVEN Cashflow component is initialised in START_ORIGINATION state', () => {
    beforeEach(() => {
      const cashflow = Object.assign({}, cashflowfile);
      cashflow.status = 'START_ORIGINATION';
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflow));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));

      component.ngOnInit();
      fixture.detectChanges();
    });

    test('THEN the submit for processing button should be hidden', () => {
      expect(getByTestId(fixture, 'submit-processing')).toBeNull();
    });

    test('THEN the submit for origination button should be hidden', () => {
      expect(getByTestId(fixture, 'submit-proposal')).toBeNull();
    });
  });

  describe('GIVEN Cashflow component is initialised in SUBMITTED_TO_TRADE state', () => {
    beforeEach(() => {
      const cashflow = Object.assign({}, cashflowfile);
      cashflow.status = 'SUBMITTED_TO_TRADE';
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflow));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));

      component.ngOnInit();
      fixture.detectChanges();
    });

    test('THEN the submit for origination button should be hidden', () => {
      expect(getByTestId(fixture, 'submit-proposal')).toBeNull();
    });
  });

  describe('GIVEN submitForProcessing is called', () => {
    describe('AND cashflow file processing return file with CASHFLOW_CREATION_END status', () => {
      beforeEach(() => {
        cashflowDataService.updateCashflowStatus.mockReturnValue(of(cashflowfile));
        mockAuthService.isAuthorised.mockReturnValue(
          new Promise((resolve, reject) => {
            return resolve(true);
          }),
        );
      });
      test('THEN submit for proposal button is displayed', () => {
        cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfile));
        cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));
        cashflowService.getValidCashflows.mockReturnValue(validCashflows);
        component.canSubmitToOriginationProposal = true;
        expect(getByTestId(fixture, 'submit-proposal')).toBeNull();
        expect(component.busy).toBe(false);

        component.submitForProcessing();
        fixture.detectChanges();

        expect(component.busy).toBe(false);
        expect(getByTestId(fixture, 'submit-proposal')).toBeTruthy();

        getByTestId(fixture, 'submit-proposal').nativeElement.click();

        expect(matDialog.open).toHaveBeenCalled();
      });
    });
  });

  describe('GIVEN cashflowFile has failures i.e status as FAILED_PROCESSING', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfileWithFailures));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();
    });
    test('THEN the failures should be displayed in the table', () => {
      const firstFailureRowNumber = fixture.nativeElement
        .querySelector('[data-testid="failure-row-0"] > [data-testid="cashflow-file-row"]')
        .textContent.trim();
      const firstFailureMessage = fixture.nativeElement
        .querySelector('[data-testid="failure-row-0"] > [data-testid="message"]')
        .textContent.trim();

      expect(firstFailureRowNumber).toEqual(
        cashflowfileWithFailures.processingFailureMessages[0].rowFailed.toString(),
      );
      expect(firstFailureMessage).toEqual(
        cashflowfileWithFailures.processingFailureMessages[0].message.toString(),
      );
    });
    test('THEN Submit file for processing button should be disabled', () => {
      const submitButton = fixture.nativeElement.querySelector('[data-testid="submit-processing"]');
      expect(submitButton.disabled).toEqual(true);
    });
  });

  describe('GIVEN cashflowFile has been REJECTED', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfileRejected));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();
    });
    test('THEN REJECTED should be visible', () => {
      const rejectedHeader = fixture.nativeElement.querySelector('[data-testid="reject-header"]');
      expect(rejectedHeader).toBeTruthy();
    });
    test('THEN rejected user and time should be set', () => {
      const rejectUserTime = fixture.nativeElement.querySelector(
        '[data-testid="reject-user-time"]',
      );
      expect(rejectUserTime).toBeTruthy();
      expect(rejectUserTime.textContent).toContain(cashflowfileRejected.rejectionDetail.user);
      expect(rejectUserTime.textContent).toContain(cashflowfileRejected.rejectionDetail.date);
    });
    test('THEN rejected message should be set', () => {
      const rejectMessage = fixture.nativeElement.querySelector('[data-testid="reject-message"]');
      expect(rejectMessage).toBeTruthy();
      expect(rejectMessage.textContent).toContain(cashflowfileRejected.rejectionDetail.message);
    });
    test('THEN Submit file for processing button not be visible', () => {
      const submitButton = fixture.nativeElement.querySelector('[data-testid="submit-processing"]');
      expect(submitButton).toBeFalsy();
    });
    test('THEN Reject button should not be visible', () => {
      const rejectButton = fixture.nativeElement.querySelector('[data-testid="reject"]');
      expect(rejectButton).toBeFalsy();
    });
    test('THEN the submit for origination button should be hidden', () => {
      expect(getByTestId(fixture, 'submit-proposal')).toBeNull();
    });
    test('THEN Valid and Invalid cashflow table should be visibile', () => {
      expect(getByTestId(fixture, 'cashflows-table-card')).toBeTruthy();
    });
    test('THEN cash flow file card should be visible', () => {
      expect(getByTestId(fixture, 'cashflow-file-card')).toBeTruthy();
    });
    test('THEN contract card, cashflows-card-submitted should be hidden', () => {
      expect(getByTestId(fixture, 'contract-card')).toBeTruthy();
      expect(getByTestId(fixture, 'cashflows-card-submitted')).toBeTruthy();
    });
  });

  describe('GIVEN cashflowsummary has as all cashflowfailures', () => {
    beforeEach(() => {
      cashflowDataService.getCashflowFile.mockReturnValue(of(cashflowfile));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of([cashflows[3], cashflows[5]]));
      cashflowService.getUniqueSellers.mockReturnValue([]);
      component.ngOnInit();
      fixture.detectChanges();
    });
    test('THEN unique sellers should be empty', () => {
      expect(component.uniqueSellers.length).toEqual(0);
    });
  });

  describe('GIVEN Cashflow component is initialised with cfFile status as END_PROCESSING', () => {
    beforeEach(() => {
      const cfFileInEndProcessing = { ...cashflowfileWithTotals };
      cfFileInEndProcessing.status = 'END_PROCESSING';

      cashflowDataService.getCashflowFile.mockReturnValue(of(cfFileInEndProcessing));
      cashflowDataService.getCashflowSummaries.mockReturnValue(of(cashflows));
      cashflowService.getValidCashflows.mockReturnValue(validCashflows);
      cashflowService.getInvalidCashflows.mockReturnValue(invalidCashflows);
      cashflowService.getUniqueSellers.mockReturnValue([
        cashflows[0].entityTwo,
        cashflows[2].entityOne,
        cashflows[4].entityOne,
      ]);
      cashflowService.getCashflowContracts.mockReturnValue([
        {
          id: 'the-contract-id1',
          name: 'the contract name',
        },
        {
          id: 'the-contract-id2',
          name: 'the second contract name',
        },
      ]);

      component.ngOnInit();
      fixture.detectChanges();
    });
    describe('AND user has the checker right for cashflow', () => {
      test('THEN Submit File for Processing button should be enabled', async () => {
        const submitButton = fixture.nativeElement.querySelector(
          '[data-testid="submit-processing"]',
        );

        fixture.detectChanges();
        expect(submitButton.disabled).toEqual(false);
      });

      test('THEN REJECT button should be disabled', async () => {
        const rejectButton = fixture.nativeElement.querySelector('[data-testid="reject"]');

        fixture.detectChanges();
        expect(rejectButton.disabled).toEqual(false);
      });
    });

    describe('GIVEN cashflow file has been processed and received', () => {
      test('THEN Retrieve the processedDate', () => {
        const processedBy = fixture.nativeElement.querySelector('.processed-by');
        const cashFlowDetails = {
          ...cashflowfile,
          processedDate: '2020-09-29T11:20:19.078707Z',
        };

        fixture.whenStable().then(() => {
          expect(cashFlowDetails.processedDate).toEqual('2020-09-29T11:20:19.078707Z');
          expect(processedBy.textContent).toContain('Sep 29, 2020, 12:20:19 PM');
        });
      });
    });
  });

  describe('GIVEN there are cashflows are in a `RECEIVED` or `VALIDATED` state', () => {
    beforeEach(() => {
      const cashflowSummaries = {
        ...invalidCashflows[0],
        state: 'RECEIVED',
      };
      component.allCashFlowSummaries = [cashflowSummaries];
    });
    test('THEN there are unprocessed cashflows', () => {
      expect(component.hasUnprocessedCashflows()).toBeTruthy();
    });
    test('THEN valid cashflow count should be undefined', () => {
      expect(component.validCashflowCount()).toBeUndefined();
    });
    test('THEN invalid & failed cashflow count should be undefined', () => {
      expect(component.invalidAndFailedCashflowCount()).toBeUndefined();
    });
  });
});
