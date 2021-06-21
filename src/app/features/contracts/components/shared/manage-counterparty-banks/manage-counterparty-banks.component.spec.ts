import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCounterpartyBanksComponent } from './manage-counterparty-banks.component';
import { MockService } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import Mocked = jest.Mocked;
import { of, throwError } from 'rxjs';
import { getByTestId } from '@app/shared/utils/test';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { ContractCounterparty } from '../../../models/counterparty.model';
import { BankRequest, Bank } from '../../../models/counterparty-bank';

describe('ManageCounterpartyBanksComponent', () => {
  let component: ManageCounterpartyBanksComponent;
  let fixture: ComponentFixture<ManageCounterpartyBanksComponent>;
  const counterpartyService: Mocked<CounterpartyService> = MockService(
    CounterpartyService,
  ) as Mocked<CounterpartyService>;

  const counterparty: ContractCounterparty = {
    name: 'Acme Ltd.',
    role: 'Supplier',
    roleType: 'PRIMARY',
    id: 'FFF-AAA',
    counterpartyReference: 'string',
    contract: {
      productCategoryName: '',
      productCategoryId: '',
      productName: '',
      id: '180afbb9-91e5-42e5-9c1b-9474bbce691c',
      name: 'B Coupa contract',
      channelReference: '123',
      partnerId: 'COUPA-PARTNER-1',
      status: 'ACTIVE',
      productId: 'SCF_123',
      product: 'SCF',
      created: null,
      rules: [],
      bypassTradeAcceptance: false,
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
    },
  };
  const bankRequest: BankRequest = {
    account: {
      domesticAccountId: 'domesticAccountId',
      iban: 'iban',
      name: 'name',
    },
    bankName: 'bankName',
    branch: {
      address: {
        city: 'city',
        country: 'country',
        line1: 'line1',
        line2: 'line2',
        line3: 'line3',
        line4: 'line4',
        postalCode: 'postalCode',
        region: 'region',
      },
      bic: 'bic',
      domesticBranchId: 'domesticBranchId',
      name: 'name',
    },
    currency: 'currency',
  };

  const banks: Bank[] = [
    {
      id: '123',
      currency: 'GBP',
      bankName: 'ABCDE',
      branch: {
        name: 'Some Other Bank',
        address: {
          line1: 'Some Other Bank',
          line2: 'Some Other Horsey Way',
          line3: 'some other line 3',
          line4: 'Some other line 45',
          city: 'London',
          region: 'London',
          country: 'GB',
          postalCode: '12345',
        },
        bic: 'NWBKGB2LZZZ',
        domesticBranchId: 'some-other-dom-branch-id',
      },
      account: {
        name: 'Some Other Account Holder',
        iban: 'GB95BARC20039534897718',
        domesticAccountId: 'some-other-account-id',
      },
    },

    {
      id: '456',
      currency: 'AED',
      bankName: 'HDFC',
      branch: {
        name: 'Some Bank',
        address: {
          line1: '99 Some Bank',
          line2: 'Horsey Way',
          line3: 'some line 3',
          line4: 'Some line 3',
          city: 'New York City',
          region: 'New York',
          country: 'US',
          postalCode: '10270',
        },
        bic: 'NWBKGB2LXXX',
        domesticBranchId: 'dom-branch-id',
      },
      account: {
        name: 'Account Holder',
        iban: 'GB33BUKB20201555555555',
        domesticAccountId: 'string',
      },
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        GdsDataTableModule,
        NoopAnimationsModule,
      ],
      declarations: [ManageCounterpartyBanksComponent],
      providers: [
        {
          provide: CounterpartyService,
          useValue: counterpartyService,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: counterparty,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    counterpartyService.getBanks.mockReturnValue(of(banks));

    fixture = TestBed.createComponent(ManageCounterpartyBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('WHEN the component has been initialised', () => {
    test('THEN it should initialise with counterparty information', () => {
      expect(component).toBeTruthy();
      expect(component.counterparty).toEqual(counterparty);
    });
    test('THEN banks should be populated', () => {
      expect(component.banks.length).toBe(2);
    });

    test('THEN getBanks should be called with counterpartyId', () => {
      expect(counterpartyService.getBanks).toHaveBeenCalledWith('FFF-AAA');
    });

    test('THEN action should be set to list', () => {
      expect(component.action).toBe('list');
    });

    test('THEN title should be displayed correctly', () => {
      expect(getByTestId(fixture, 'title').nativeElement.textContent).toBe(
        'Bank details for Acme Ltd.',
      );
    });

    test('THEN add Bank button Should be present', () => {
      expect(getByTestId(fixture, 'add-counterparty-bank')).toBeTruthy();
    });
  });

  describe('WHEN the addBank is called', () => {
    beforeEach(() => {
      component.addBank();
    });
    test('THEN action should be add', () => {
      expect(component.action).toEqual('add');
    });

    test('THEN title should be displayed correctly', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'title').nativeElement.textContent).toBe(
        'Add new bank details for Acme Ltd.',
      );
    });

    test('THEN form should be initialised', () => {
      const expectedFormValue = {
        account: { domesticAccountId: null, iban: null, name: null },
        bankName: null,
        branch: {
          address: {
            city: null,
            country: null,
            line1: null,
            line2: null,
            line3: null,
            line4: null,
            postalCode: null,
            region: null,
          },
          bic: null,
          domesticBranchId: null,
          name: null,
        },
        currency: null,
      };

      expect(component.form.value).toEqual(expectedFormValue);
    });
  });

  describe('WHEN the cancelAddBank is called', () => {
    beforeEach(() => {
      component.cancelAddBank();
    });
    test('THEN getBanks should be called with counterpartyId', () => {
      expect(counterpartyService.getBanks).toHaveBeenCalledWith('FFF-AAA');
    });

    test('THEN banks should be populated', () => {
      expect(component.banks.length).toBe(2);
    });

    test('THEN action should be set to list', () => {
      expect(component.action).toBe('list');
    });

    test('THEN title should be displayed correctly', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'title').nativeElement.textContent).toBe(
        'Bank details for Acme Ltd.',
      );
    });
  });
  describe('WHEN the popOverEvent is called with event parameter', () => {
    beforeEach(() => {
      component.addBank();
      component.form.setValue(bankRequest);
      component.popOverEvent({ row: { id: '123', currency: 'USD' } });
    });
    test('THEN popOverEvent(event) should set currency list to one long', () => {
      expect(component.currencyList).toEqual(['USD']);
    });
    test('THEN action should be set to update', () => {
      expect(component.action).toBe('update');
    });

    test('THEN title should be displayed correctly', () => {
      fixture.detectChanges();
      expect(getByTestId(fixture, 'title').nativeElement.textContent).toBe(
        'Update bank details for Acme Ltd.',
      );
    });
  });
  describe('WHEN the saveBank is called', () => {
    beforeEach(() => {
      component.addBank();
      component.form.setValue(bankRequest);
    });

    test('THEN iban and bic needs to be set to null if empty', () => {
      counterpartyService.addBank.mockReturnValue(of());
      const requestWIthBlankIBANAndBIC = {
        account: {
          domesticAccountId: 'domesticAccountId',
          iban: '',
          name: 'name',
        },
        bankName: 'bankName',
        branch: {
          address: {
            city: 'city',
            country: 'country',
            line1: 'line1',
            line2: null,
            line3: null,
            line4: null,
            postalCode: 'postalCode',
            region: 'region',
          },
          bic: '',
          domesticBranchId: 'domesticBranchId',
          name: 'name',
        },
        currency: 'currency',
      };
      component.form.setValue(requestWIthBlankIBANAndBIC);
      component.saveBank();

      const expectedRequest = {
        account: {
          domesticAccountId: 'domesticAccountId',
          iban: null,
          name: 'name',
        },
        bankName: 'bankName',
        branch: {
          address: {
            city: 'city',
            country: 'country',
            line1: 'line1',
            line2: null,
            line3: null,
            line4: null,
            postalCode: 'postalCode',
            region: 'region',
          },
          bic: null,
          domesticBranchId: 'domesticBranchId',
          name: 'name',
        },
        currency: 'currency',
      };
      expect(counterpartyService.addBank).toHaveBeenCalledWith('FFF-AAA', expectedRequest);
    });

    test('THEN addBank should be called with counterpartyId and bankRequest', () => {
      counterpartyService.addBank.mockReturnValue(of());
      component.saveBank();

      expect(counterpartyService.addBank).toHaveBeenCalledWith('FFF-AAA', bankRequest);
    });

    test('THEN updateBank should be called with counterpartyId and bankRequest', () => {
      counterpartyService.updateBank.mockReturnValue(of());
      const bank: any = {};
      Object.assign(bank, bankRequest);
      bank.id = '123';
      component.popOverEvent({
        row: bank,
      });
      component.updateBank();

      expect(counterpartyService.updateBank).toHaveBeenCalledWith('FFF-AAA', '123', bankRequest);
    });

    test('THEN getBanks should be called on success', () => {
      counterpartyService.addBank.mockReturnValue(of());
      component.saveBank();

      expect(counterpartyService.getBanks).toHaveBeenCalledWith('FFF-AAA');
    });

    test('THEN should set serverError from backend when return otherthan 400', () => {
      counterpartyService.addBank.mockReturnValue(throwError({ status: 500 }));
      component.saveBank();

      expect(component.serverError).toBe('Error from Backend please try again later');
    });

    test('THEN should set error when backend return 400 with validationError', () => {
      counterpartyService.addBank.mockReturnValue(
        throwError({
          status: 400,
          error: {
            title: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: [
              {
                target: 'account.iban',
                code: 'INVALID',
                description: 'must be a valid ISO 13616:2007 IBAN',
              },
              {
                target: 'branch.bic',
                code: 'INVALID',
                description: 'must be a valid ISO 9362 BIC',
              },
            ],
          },
        }),
      );
      component.saveBank();

      expect(component.form.controls.account.controls.iban.errors).toEqual({
        iban: 'must be a valid ISO 13616:2007 IBAN',
      });
      expect(component.form.controls.branch.controls.bic.errors).toEqual({
        bic: 'must be a valid ISO 9362 BIC',
      });
    });

    test('THEN should set serverError from backend returns 400 with GBE error', () => {
      counterpartyService.addBank.mockReturnValue(
        throwError({
          status: 400,
          error: [
            {
              code: 'BANK_ACCOUNT_VALIDATION_FAILURE',
              message: 'The IBAN is incorrect for the Branch location (country code [ US ])',
            },
          ],
        }),
      );
      component.saveBank();

      expect(component.serverError).toBe(
        'The IBAN is incorrect for the Branch location (country code [ US ])',
      );
    });
  });
});
