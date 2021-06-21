import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { moduleDeclarations, moduleImports } from '../../../contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CounterpartyService } from '../../../services/counterparty.service';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import { of } from 'rxjs';
import {
  CreditApprovalDialogComponent,
  CreditApprovalDialogData,
} from './credit-approval-dialog.component';

const mockCounterpartyService: Mocked<CounterpartyService> = MockService(
  CounterpartyService,
) as Mocked<CounterpartyService>;

const dialogData: CreditApprovalDialogData = {
  contract: {
    productName: '',
    productCategoryName: '',
    productCategoryId: '',
    facility: {
      id: 'FAC-123',
      name: 'Facility 123',
    },
    id: null,
    status: null,
    name: null,
    channelReference: null,
    partnerId: null,
    product: null,
    productId: null,
    created: null,
    rules: null,
    currencies: null,
    bypassTradeAcceptance: false,
  },
  counterparty: {
    id: 'CP-123',
    entityId: 'ENT-123',
    name: 'Acme Ltd.',
    role: 'Account Debtor',
    roleType: 'RELATED',
    counterpartyReference: 'ext-ref-123',
  },
};

describe('GIVEN CreditApprovalDialogComponent', () => {
  let component: CreditApprovalDialogComponent;
  let fixture: ComponentFixture<CreditApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        { provide: CounterpartyService, useValue: mockCounterpartyService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('THEN is should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN approved selected ', () => {
    test('THEN it should be approved', () => {
      mockCounterpartyService.updateCreditStatus.mockImplementation(() => {
        return of({});
      });

      component.approve();

      expect(mockCounterpartyService.updateCreditStatus).toBeCalledWith('CP-123', 'APPROVED');
    });
  });

  describe('WHEN reject selected ', () => {
    test('THEN it should be rejected', () => {
      mockCounterpartyService.updateCreditStatus.mockImplementation(() => {
        return of({});
      });

      component.reject();

      expect(mockCounterpartyService.updateCreditStatus).toBeCalledWith('CP-123', 'REJECTED');
    });
  });
});
