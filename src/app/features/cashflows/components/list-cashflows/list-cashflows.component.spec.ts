import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCashflowsComponent } from '@app/features/cashflows/components/list-cashflows/list-cashflows.component';
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
import { listCashflowsCrumb } from '@app/features/cashflows/components/list-cashflows/list-cashflows.crumb';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { SharedModule } from '@app/shared/shared.module';
import { Cashflow } from '@app/features/cashflows/models/cashflow';

describe('ListCashflow', () => {
  let component: ListCashflowsComponent;
  let fixture: ComponentFixture<ListCashflowsComponent>;

  const crumbService: Mocked<CrumbService> = MockService(CrumbService) as Mocked<CrumbService>;
  const cashflowService: Mocked<CashflowDataService> = MockService(CashflowDataService) as Mocked<
    CashflowDataService
  >;

  const CASHFLOWS: Cashflow[] = [
    {
      id: '111',
      cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      documentReference: 'INVOICE99',
      state: 'ACCEPTED',
      currency: 'USD',
      unitPrice: 123.34,
      certifiedAmount: 123.34,
      issueDate: '2020-03-01',
      originalDueDate: '2020-08-23',
      originalValue: 1000.0,
      fundingAmount: 900.0,
    },
    {
      id: '222',
      cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      documentReference: 'INVOICE99',
      state: 'BLOCKED',
      currency: 'GBP',
      unitPrice: 100,
      certifiedAmount: 123.34,
      issueDate: '2020-05-11',
      originalDueDate: '2020-08-11',
      originalValue: 9999.0,
      fundingAmount: 900.0,
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCashflowsComponent],
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
        { provide: CashflowDataService, useValue: cashflowService },
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    cashflowService.getCashflows.mockReturnValue(of(CASHFLOWS));

    fixture = TestBed.createComponent(ListCashflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cashflowService.getCashflows.mockClear();
  });

  describe('GIVEN the component has been initialised', () => {
    test('THEN it should set breadcrumbs', () => {
      expect(crumbService.setCrumbs).toHaveBeenCalledWith(listCashflowsCrumb());
    });

    test('THEN it should initialise with list of entities', () => {
      component.ngOnInit();
      expect(component.cashflows).toEqual(CASHFLOWS);
    });
  });
});
