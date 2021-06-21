import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartyListComponent } from './counterparty-list.component';
import Mocked = jest.Mocked;
import { AuthService } from '@app/auth/auth-service';

import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { MockService } from 'ng-mocks';
import { ContractCounterparty } from '../../../models/counterparty.model';
import { Contract } from '@app/features/contracts/models/contract.model';

let mockAuthService: Mocked<AuthService>;
const counterparties: ContractCounterparty[] = [
  {
    name: 'CP A',
    role: 'role',
    roleType: 'PRIMARY',
    id: 'id_A',
    entityId: null,
    counterpartyReference: 'CP_A',
    verificationStatus: 'ACTIVE',
  },
  {
    name: 'CP B',
    role: 'role2',
    roleType: 'RELATED',
    id: 'id_B',
    entityId: null,
    counterpartyReference: 'CP_B',
    verificationStatus: 'INACTIVE',
    exceptions: [
      {
        code: 'LIMIT_REQUIREMENTS_NOT_MET',
        message: 'No Limits',
      },
    ],
  },
  {
    name: 'CP C',
    role: 'role3',
    roleType: 'PRIMARY',
    id: 'id_C',
    entityId: null,
    counterpartyReference: 'CP_C',
    verificationStatus: 'INACTIVE',
    exceptions: [
      {
        code: 'CREDIT_APPROVAL_REQUIRED',
        message: 'No credit approval',
      },
    ],
  },
];
const sampleContract: Contract = {
  productName: '',
  productCategoryName: '',
  productCategoryId: '',
  id: 'abc123',
  name: 'Sample Contract',
  status: 'PENDING_APPROVAL',
  channelReference: 'Channel Six',
  partnerId: 'Partners ID',
  productId: 'BP_99',
  product: 'Base Product',
  created: '2020-06-18',
  rules: [
    {
      name: 'Rule 1',
      resolutionType: null,
      resource: 'PRICING',
      expression: 'expr1',
      code: 'CDE1',
      message: 'MSG1',
      matchExpression: null,
      outcomeType: 'RESOLVABLE',
      outcomeDescription: null,
    },
    {
      name: 'Rule 2',
      resolutionType: null,
      resource: 'PRICING',
      expression: 'expr2',
      code: 'CDE2',
      message: 'MSG2',
      matchExpression: null,
      outcomeType: 'TERMINAL',
      outcomeDescription: 'description of terminal',
    },
  ],
  currencies: {
    USD: {
      referenceRateType: 'string',
      dayCountConvention: 'string',
      decimals: 2,
      minCashflowAmount: 1,
      maxCashflowAmount: 10,
      minPaymentAmount: 1,
      maxPaymentAmount: 10,
      paymentDate: { calendars: [], adjustmentType: 'string' },
      acceptanceDate: { calendars: [], adjustmentType: 'string' },
      maturityDate: { calendars: [], adjustmentType: 'string', bufferDays: 2, setDay: 1 },
    },
  },
  bypassTradeAcceptance: false,
};
const contractA = sampleContract;

const contractB = sampleContract;
contractB.status = 'APPROVED';
contractB.currencies = {};

const contractC = sampleContract;
contractC.status = 'ACTIVE';
contractB.currencies = null;

describe('CounterpartyListComponent', () => {
  let contractRow = 0;
  const contracts = [contractA, contractB, contractC];
  let component: CounterpartyListComponent;
  let fixture: ComponentFixture<CounterpartyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [...moduleImports],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService = MockService(AuthService) as Mocked<AuthService>,
        },
      ],
    }).compileComponents();

    mockAuthService.isAuthorised.mockReturnValue(
      new Promise((resolve, reject) => {
        return resolve(true);
      }),
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterpartyListComponent);
    component = fixture.componentInstance;
    component.contract = contracts[contractRow];
    fixture.detectChanges();
    contractRow++;
    component.isActive = !component.isActive;
  });

  describe('GIVEN CounterpartyListComponent is initialised', () => {
    test('THEN test component created AND render a table of counterparties, when row PENDING_APPROVAL then Delete counterparty optiob is showing', () => {
      expect(component).toBeTruthy();
      component.counterparties = counterparties;
      fixture.detectChanges();
      expect(fixture).toBeTruthy();
      fixture.nativeElement.querySelector('[data-testid="test-data-elipse"]').click();
      fixture.whenStable().then(() => {
        const menu = fixture.nativeElement.querySelector('[data-testid="test-data-elipse-menu"]');
        expect(menu.textContent).toContain('Delete counterparty');
        expect(menu.textContent).toContain('Set Margin');
        expect(menu.textContent).toContain('Manage bank details');
      });
    });

    test('THEN render a table of counterparties, when row APPROVED then Delete counterparty optiob is not showing', () => {
      component.counterparties = counterparties;
      fixture.detectChanges();
      expect(fixture).toBeTruthy();
      fixture.nativeElement.querySelector('[data-testid="test-data-elipse"]').click();
      fixture.whenStable().then(() => {
        const menu = fixture.nativeElement.querySelector('[data-testid="test-data-elipse-menu"]');
        expect(menu.textContent).not.toContain('Delete counterparty');
        expect(menu.textContent).not.toContain('Set Margin');
        expect(menu.textContent).not.toContain('Manage bank details');
      });
    });
    test('THEN render a table of counterparties, when row ACTIVE then Delete counterparty not showing', () => {
      component.counterparties = counterparties;
      fixture.detectChanges();
      expect(fixture).toBeTruthy();
      fixture.nativeElement.querySelector('[data-testid="test-data-elipse"]').click();
      fixture.whenStable().then(() => {
        const menu = fixture.nativeElement.querySelector('[data-testid="test-data-elipse-menu"]');
        expect(menu.textContent).not.toContain('Delete counterparty');
        expect(menu.textContent).not.toContain('Set Margin');
        expect(menu.textContent).not.toContain('Manage bank details');
      });
    });
  });
});
