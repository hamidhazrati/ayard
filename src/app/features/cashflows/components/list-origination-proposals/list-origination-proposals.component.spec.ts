import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SpinnerOverlayService } from '@app/services/spinner-overlay/spinner-overlay.service';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { SharedModule } from '@app/shared/shared.module';
import { ListOriginationProposalsComponent } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.component';
import { CashflowTotal } from '@app/features/cashflows/models/cashflow-total';
import { listOriginationProposalsCrumb } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.crumb';

describe('ListOriginationProposals', () => {
  let component: ListOriginationProposalsComponent;
  let fixture: ComponentFixture<ListOriginationProposalsComponent>;

  const crumbService: Mocked<CrumbService> = MockService(CrumbService) as Mocked<CrumbService>;
  const spinnerOverlayService: Mocked<SpinnerOverlayService> = MockService(
    SpinnerOverlayService,
  ) as Mocked<SpinnerOverlayService>;
  const cashflowDataService: Mocked<CashflowDataService> = MockService(
    CashflowDataService,
  ) as Mocked<CashflowDataService>;

  const CASHFLOW_TOTALS: CashflowTotal[] = [
    {
      referenceRateType: 'LIBOR',
      cashflowFileId: 'aaa',
      currency: 'USD',
      contractId: 'contract-123',
      contractName: 'contract-123-name',
      contractAdvanceRate: 90,
      contractSpread: 15,
      acceptanceDate: '2020-10-01',
      totalOriginalValue: 100.0,
      totalInitialFundingAmount: 90.0,
      totalDiscountAmount: 5,
      totalPaymentAmount: 85.5,
      totalCashflows: 30,
      referenceRateDate: '2020-08-02',
      multipleMargins: false,
      multipleAdvanceRate: false,
      cashflowFile: {
        id: 'cf_id_1',
        clientName: 'ABC Corp',
        filename: 'filename.xlsx',
        uploadDate: '2020-08-01',
        uploadedBy: 'Dave',
        status: 'PENDING_PROCESSING',
        cashflowRowCount: 10,
        processingFailureMessages: [],
        processedBy: 'Batman',
      },
    },
    {
      referenceRateType: 'LIBOR',
      cashflowFileId: 'bbb',
      currency: 'GBP',
      contractId: 'contract-555',
      contractName: 'contract-555-name',
      contractAdvanceRate: 60,
      contractSpread: 10,
      acceptanceDate: '2020-11-01',
      totalOriginalValue: 200.0,
      totalInitialFundingAmount: 90.0,
      totalDiscountAmount: 10,
      totalPaymentAmount: 81.0,
      totalCashflows: 25,
      referenceRateDate: '2020-08-02',
      multipleMargins: false,
      multipleAdvanceRate: false,
      cashflowFile: {
        id: 'cf_id_2',
        clientName: 'XYZ Ltd',
        filename: 'filename_222.xlsx',
        uploadDate: '2020-08-15',
        uploadedBy: 'Sally',
        status: 'PENDING_PROCESSING',
        cashflowRowCount: 20,
        processingFailureMessages: [],
        processedBy: 'Batman',
      },
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListOriginationProposalsComponent],
      imports: [
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: CrumbService, useValue: crumbService },
        { provide: SpinnerOverlayService, useValue: spinnerOverlayService },
        { provide: CashflowDataService, useValue: cashflowDataService },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    cashflowDataService.getCashflowTotals.mockReturnValue(of(CASHFLOW_TOTALS));

    fixture = TestBed.createComponent(ListOriginationProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cashflowDataService.getCashflowTotals.mockClear();
  });

  describe('GIVEN the component', () => {
    describe('WHEN the component has been initialised', () => {
      test('THEN it should set breadcrumbs', () => {
        expect(crumbService.setCrumbs).toHaveBeenCalledWith(listOriginationProposalsCrumb());
      });

      test('THEN it should show spinner', () => {
        expect(spinnerOverlayService.show).toHaveBeenCalled();
      });

      test('THEN it should initialise with list of entities', () => {
        component.ngOnInit();
        expect(component.cashflowTotals).toEqual(CASHFLOW_TOTALS);
      });

      test('THEN the spinner should be hidden once initialised', () => {
        component.refresh();
        expect(spinnerOverlayService.hide).toHaveBeenCalled();
      });

      test('THEN rows should be displayed in order', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const sellerNames = fixture.nativeElement.querySelectorAll('[data-testid="seller-name"]');
          expect(sellerNames[0].textContent.trim()).toEqual(
            CASHFLOW_TOTALS[0].cashflowFile.clientName,
          );
          expect(sellerNames[1].textContent.trim()).toEqual(
            CASHFLOW_TOTALS[1].cashflowFile.clientName,
          );
        });
      }));

      test('THEN spread is converted to margin', async(() => {
        component.ngOnInit();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const margins = fixture.nativeElement.querySelectorAll('[data-testid="margin"]');
          expect(margins[0].textContent.trim()).toEqual('0.15%');
          expect(margins[1].textContent.trim()).toEqual('0.10%');
        });
      }));
    });
  });
});
