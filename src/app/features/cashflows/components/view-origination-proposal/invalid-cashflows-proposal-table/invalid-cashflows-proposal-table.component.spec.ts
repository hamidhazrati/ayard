import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidCashflowsProposalTableComponent } from './invalid-cashflows-proposal-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CashflowSummary } from '../../../models/cashflow-summary';

const invalidCashflows: CashflowSummary[] = [
  {
    id: 'abc-0',
    cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    entityOne: {
      id: '123abc',
      name: 'Entity One',
      role: 'Seller',
    },
    entityTwo: {
      id: '789ghi',
      name: 'Entity Three',
      role: 'Account Debtor',
    },
    contract: {
      id: 'the-contract-id1',
      name: 'the contract name',
    },
    issueDate: '2020-05-09',
    originalDueDate: '2020-05-10',
    currency: 'USD',
    originalValue: 8888.0,
    state: 'REJECTED',
    unitPrice: 123.34,
    certifiedAmount: 123.34,
    documentReference: 'ABCD0002',
    cashflowReference: 'abc-0-cr',
    settlementAmount: 23,
    annualisedMarginRate: 32,
    fundingAmount: 900.0,
    advanceRate: 90,
    maturityDate: '2020-10-23',
    reasonForFailure: [
      {
        code: 'SINGLE_SUPPLIER',
        message: 'Must be one and only one supplier on the cashflow',
      },
      {
        code: 'SUPPLIER_NOT_ON_CONTRACT',
        message: 'The SUPPLIER is not on the Contract',
      },
    ],
    bufferPeriod: 2,
    acceptanceDate: '2020-08-13',
    adjustment: 15,
    leadDays: 14,
    referenceRate: 10,
    hasFailures: false,
    insuranceType: 'INSURED',
  },
  {
    id: 'abc-1',
    cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b176',
    entityOne: {
      id: '123abc',
      name: 'Entity One',
      role: 'Seller',
    },
    entityTwo: {
      id: '789ghi',
      name: 'Entity Three',
      role: 'Account Debtor',
    },
    contract: {
      id: 'the-contract-id1',
      name: 'the contract name',
    },
    issueDate: '2020-05-09',
    originalDueDate: '2020-05-10',
    currency: 'USD',
    originalValue: 8887.0,
    state: 'CONTRACT_NOT_FOUND',
    unitPrice: 123.34,
    certifiedAmount: 123.34,
    documentReference: 'ABCD0002',
    fundingAmount: 900.0,
    advanceRate: 90,
    maturityDate: '2020-10-23',
    reasonForFailure: [
      {
        code: 'CONTRACT_NOT_FOUND',
        message: 'Contract not found',
      },
    ],
    bufferPeriod: undefined,
    acceptanceDate: undefined,
    cashflowReference: undefined,
    settlementAmount: 23,
    annualisedMarginRate: 32,
    adjustment: 15,
    leadDays: 14,
    referenceRate: 10,
    hasFailures: false,
    insuranceType: 'INSURED',
  },
  {
    id: 'abc-2',
    cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b176',
    entityOne: {
      id: '123abc',
      name: 'Entity One',
      role: 'Seller',
    },
    entityTwo: {
      id: '789ghi',
      name: 'Entity Three',
      role: 'Account Debtor',
    },
    contract: {
      id: 'the-contract-id1',
      name: 'the contract name',
    },
    issueDate: '2020-05-09',
    originalDueDate: '2020-05-10',
    currency: 'USD',
    originalValue: 8887.0,
    state: 'ERROR_IN_PROCESSSING',
    unitPrice: 123.34,
    certifiedAmount: 123.34,
    documentReference: 'ABCD0002',
    fundingAmount: 900.0,
    advanceRate: 90,
    maturityDate: '2020-10-23',
    reasonForFailure: [],
    bufferPeriod: undefined,
    acceptanceDate: undefined,
    cashflowReference: 'abc-2-cr',
    settlementAmount: null,
    annualisedMarginRate: undefined,
    adjustment: 15,
    leadDays: 14,
    referenceRate: 10,
    hasFailures: false,
    insuranceType: 'INSURED',
  },
];

describe('InvalidCashflowsProposalTableComponent', () => {
  let component: InvalidCashflowsProposalTableComponent;
  let fixture: ComponentFixture<InvalidCashflowsProposalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, MatIconModule, MatTooltipModule],
      declarations: [InvalidCashflowsProposalTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidCashflowsProposalTableComponent);
    component = fixture.componentInstance;
    component.cashflowSummaries = invalidCashflows;
    fixture.detectChanges();
  });

  describe('GIVEN InvalidCashflowsProposalTableComponent is initialised', () => {
    it('THEN it should be created', () => {
      expect(component).toBeTruthy();
    });

    it('THEN invalid reason should be correct', () => {
      fixture.detectChanges();

      const firstRow = fixture.nativeElement.querySelector('[data-testid="cashflows-row-0"]');
      expect(firstRow.innerHTML).toContain('2 failures');

      const secondRow = fixture.nativeElement.querySelector('[data-testid="cashflows-row-1"]');
      expect(secondRow.innerHTML).toContain('Contract not found');

      const thirdRow = fixture.nativeElement.querySelector('[data-testid="cashflows-row-2"]');
      expect(thirdRow.innerHTML).toContain('Unknown');
    });

    describe('GIVEN the InvalidCashflowsProposalTableComponent with input params', () => {
      xit('THEN it should render correctly', () => {
        // expect(fixture).toMatchSnapshot();
      });
    });
  });
});
