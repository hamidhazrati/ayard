import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CurrencyPricingComponent } from './currency-pricing.component';
import { CurrencyService } from '@app/services/currency/currency.service';
import { MockService } from '@app/shared/utils/test/mock';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Currency, ReferenceRate } from '@app/services/currency/currency.model';
import Mocked = jest.Mocked;
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  getByTestId,
  selectFirstOption,
  setInputValue,
  triggerClick,
} from '@app/shared/utils/test';
import { moduleImports, moduleDeclarations } from '@app/features/contracts/contracts.module';
import { CalendarService } from '@app/services/calendar/calendar.service';
import { Calendar } from '@app/services/calendar/calendar.model';
import { DebugElement } from '@angular/core';

describe('CurrencyPricingComponent', () => {
  let component: CurrencyPricingComponent;
  let fixture: ComponentFixture<CurrencyPricingComponent>;
  let currencyService: Mocked<CurrencyService>;
  let calendarService: Mocked<CalendarService>;
  let dialogRef: Mocked<MatDialogRef<any>>;

  const stubCalendars: Calendar[] = [
    {
      reference: 'GBP',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
    {
      reference: 'EUR',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
    {
      reference: 'JPY',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
  ];

  const stubCurrencies: Currency[] = [
    {
      code: 'ABC',
      decimalPlaces: 1,
      dayCountConventionCode: 'actual/actual',
    },
    {
      code: 'DEF',
      decimalPlaces: 2,
      dayCountConventionCode: '30/365',
    },
    {
      code: 'XYZ',
      decimalPlaces: 3,
      dayCountConventionCode: '1/2',
    },
  ];

  const stubReferenceRates: ReferenceRate[] = [
    {
      description: 'Test 1',
      rateType: 'TEST1',
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [moduleDeclarations],
      imports: [...moduleImports, NoopAnimationsModule],
      providers: [
        { provide: CurrencyService, useValue: currencyService = MockService(CurrencyService) },
        { provide: CalendarService, useValue: calendarService = MockService(CalendarService) },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            currencies: {
              [stubCurrencies[2].code]: stubCurrencies[2],
            },
          },
        },

        {
          provide: MatDialogRef,
          useValue: dialogRef = {
            close: jest.fn(),
          } as any,
        },
      ],
    }).compileComponents();
  }));

  describe('GIVEN reference currency data is available', () => {
    beforeEach(fakeAsync(() => {
      currencyService.getCurrencies.mockReturnValue(of(stubCurrencies));
      currencyService.getCurrencyReferenceRates.mockReturnValue(of(stubReferenceRates));
      calendarService.getCalendars.mockReturnValue(of(stubCalendars));

      fixture = TestBed.createComponent(CurrencyPricingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('GIVEN a new currency is being added', () => {
      describe('GIVEN the form', () => {
        beforeEach(() => {
          const controls = component.form.controls;
          selectFirstOption(fixture, 'currency');

          selectFirstOption(fixture, 'reference-rate-type');

          controls.acceptanceDate.setValue({
            adjustmentType: 'A',
            calendars: ['GBP'],
          });

          controls.maturityDate.setValue({
            adjustmentType: 'B',
            calendars: ['EUR'],
            bufferDays: null,
            setDay: null,
          });

          controls.paymentDate.setValue({
            adjustmentType: 'C',
            calendars: ['JPY'],
          });

          controls.amountRange.controls.paymentAmountRange.setValue({
            min: 1,
            max: 10,
          });

          controls.amountRange.controls.cashflowAmountRange.setValue({
            min: 1,
            max: 10,
          });
        });

        describe('GIVEN the mandatory fields are set with values', () => {
          test('THEN the form is valid', () => {
            const controls = component.form.controls;
            expect(controls.currency.valid).toBeTruthy();
            expect(controls.referenceRateType.valid).toBeTruthy();
            expect(controls.amountRange.controls.paymentAmountRange.valid).toBeTruthy();
            expect(controls.amountRange.controls.cashflowAmountRange.valid).toBeTruthy();
            expect(controls.acceptanceDate.valid).toBeTruthy();
            expect(controls.maturityDate.valid).toBeTruthy();
            expect(controls.paymentDate.valid).toBeTruthy();
          });
        });

        describe('WHEN save is clicked', () => {
          beforeEach(() => {
            const button = getDebugElementByTestId('save');
            triggerClick(fixture, button);
          });

          test('THEN the currency is saved', () => {
            expect(dialogRef.close).toHaveBeenCalledWith(
              expect.objectContaining({
                currencyCode: 'ABC',
                dayCountConvention: 'actual/actual',
                decimals: 1,
                referenceRateType: 'TEST1',
              }),
            );
          });
        });
      });

      describe('GIVEN the form is invalid', () => {
        describe('WHEN save is clicked', () => {
          beforeEach(() => {
            const button = getDebugElementByTestId('save');
            triggerClick(fixture, button);
          });

          test('THEN the currency is not saved', () => {
            expect(dialogRef.close).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('GIVEN the Minimum Payment Amount is a negative integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '-1');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.controls.min.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Minimum Cashflow Amount is a negative integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '-1');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.controls.min.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Maximum Payment Amount is a negative integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '-1');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.controls.max.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Maximum Cashflow Amount is a negative integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '-1');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.controls.max.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Minimum Payment Amount is greater than the Maximum Payment Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '99');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '2');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Minimum Cashflow Amount is greater than the Maximum Cashflow Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '99');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '2');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.valid).toBeFalsy();
      });
    });
    describe('GIVEN the Minimum Payment Amount is equal to the Maximum Payment Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '3');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '3');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.valid).toBeFalsy();
        expect(component.form.valid).toBeFalsy();
      });
    });
    describe('GIVEN the Minimum Cashflow Amount is equal to the Maximum Cashflow Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '3');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '3');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.valid).toBeFalsy();
        expect(component.form.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Minimum Payment Amount is less than the Maximum Payment Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '1');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '100');
      });
      test('then the validation succeeds', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.valid).toBeTruthy();
      });
    });

    describe('GIVEN the Minimum Cashflow Amount is less than the Maximum Cashflow Amount and are positive integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '1');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '100');
      });
      test('then the validation succeeds', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.valid).toBeTruthy();
      });
    });

    describe('GIVEN the Minimum Cashflow Amount and the Maximum Cashflow Amount are not entered', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '');
      });
      test('then the validation succeeds', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.cashflowAmountRange.valid).toBeTruthy();
      });
    });

    describe('GIVEN the Minimum Payment Amount and the Maximum Payment Amount are not entered', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '');
      });
      test('then the validation succeeds', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.controls.paymentAmountRange.valid).toBeTruthy();
      });
    });

    describe('GIVEN the Minimum Payment Amount is less than the Minimum Cashflow Amount', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'min-payment-amount'), '2');
        setInputValue(getByTestId(fixture, 'min-cashflow-amount'), '99');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Maximum Cashflow Amount is greater than the Maximum Payment Amount', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'max-cashflow-amount'), '99');
        setInputValue(getByTestId(fixture, 'max-payment-amount'), '2');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.amountRange.valid).toBeFalsy();
      });
    });

    describe('GIVEN the Maturity Date bufferDays is a negative integer', () => {
      beforeEach(() => {
        selectFirstOption(fixture, 'currency');
        setInputValue(getByTestId(fixture, 'maturity-date-buffer-days'), '-1');
      });
      test('then the validation fails', () => {
        const controls = component.form.controls;
        // @ts-ignore
        expect(controls.maturityDate.controls.bufferDays.valid).toBeFalsy();
      });
    });

    describe('WHEN the close button is clicked', () => {
      beforeEach(() => {
        const button = getDebugElementByTestId('close');
        triggerClick(fixture, button);
      });

      test('THEN the currency is not saved', () => {
        expect(dialogRef.close).toHaveBeenCalledWith();
      });
    });

    describe('WHEN cancel is clicked', () => {
      beforeEach(() => {
        const button = getDebugElementByTestId('cancel');
        triggerClick(fixture, button);
      });

      test('THEN the currency is not saved', () => {
        expect(dialogRef.close).toHaveBeenCalledWith();
      });
    });
  });

  function getDebugElementByTestId(testId: string): DebugElement {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}`));
  }
});
