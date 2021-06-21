import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { CurrencyAttributesCardComponent } from './currency-attributes-card.component';
import { moduleDeclarations, moduleImports } from '@app/features/contracts/contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getByTestId, triggerClick } from '@app/shared/utils/test';
import { By } from '@angular/platform-browser';

describe('CurrencyAttributesCardComponent', () => {
  let component: CurrencyAttributesCardComponent;
  let fixture: ComponentFixture<CurrencyAttributesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: moduleDeclarations,
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAttributesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('GIVEN ViewContractComponent is initialised', () => {
    beforeEach(() => {
      component.currencyEntry = {
        currencyCode: 'GBP',
        decimals: 2,
        referenceRateType: 'LIBOR',
        dayCountConvention: '365',
        minCashflowAmount: 0,
        maxCashflowAmount: 1,
        minPaymentAmount: 0,
        maxPaymentAmount: 1,
        maturityDate: {
          calendars: ['CAL1'],
          adjustmentType: 'A',
          bufferDays: 4,
          setDay: 7,
        },
        acceptanceDate: {
          calendars: ['CAL1'],
          adjustmentType: 'A',
        },
        paymentDate: {
          calendars: ['CAL1'],
          adjustmentType: 'A',
        },
      };
    });

    describe('WHEN a currency it set', () => {
      test('THEN it should shows with the currency', () => {
        fixture.detectChanges();

        expectMatch('currency-code', 'GBP');
        expectMatch('decimals', '2');
        expectMatch('day-count-convention', '365');
      });

      function expectMatch(selector: string, expectedValue: string) {
        const debugElement = getByTestId(fixture, selector);
        const value = debugElement.nativeElement.textContent.trim();
        expect(value).toEqual(expectedValue);
      }
    });

    describe('WHEN edit is selected', () => {
      beforeEach(fakeAsync(() => {
        component.readonly = true;
        spyOn(component.editCurrency, 'emit');
        triggerClick(fixture, fixture.debugElement.query(By.css('[data-testid="edit"]')));
      }));

      test('THEN edit event is emitted', () => {
        expect(component.editCurrency.emit).toHaveBeenCalledWith({
          currencyCode: 'GBP',
          dayCountConvention: '365',
          decimals: 2,
          maxCashflowAmount: 1,
          minCashflowAmount: 0,
          maxPaymentAmount: 1,
          minPaymentAmount: 0,
          referenceRateType: 'LIBOR',
          maturityDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
            bufferDays: 4,
            setDay: 7,
          },
          acceptanceDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
          },
          paymentDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
          },
        });
      });
    });

    describe('WHEN delete is selected', () => {
      beforeEach(fakeAsync(() => {
        component.readonly = true;
        spyOn(component.deleteCurrency, 'emit');
        triggerClick(fixture, fixture.debugElement.query(By.css('[data-testid="delete"]')));
      }));

      test('THEN delete event is emitted', () => {
        expect(component.deleteCurrency.emit).toHaveBeenCalledWith({
          currencyCode: 'GBP',
          dayCountConvention: '365',
          decimals: 2,
          maxCashflowAmount: 1,
          minCashflowAmount: 0,
          maxPaymentAmount: 1,
          minPaymentAmount: 0,
          referenceRateType: 'LIBOR',
          maturityDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
            bufferDays: 4,
            setDay: 7,
          },
          acceptanceDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
          },
          paymentDate: {
            calendars: ['CAL1'],
            adjustmentType: 'A',
          },
        });
      });
    });

    describe('WHEN form is readyonly', () => {
      beforeEach(fakeAsync(() => {
        component.readonly = true;
        spyOn(component.editCurrency, 'emit');
        spyOn(component.deleteCurrency, 'emit');
      }));

      test('THEN the options should be disabled', () => {
        fixture.detectChanges();

        const editButton = fixture.debugElement.query(By.css('[data-testid="edit"]'));
        expect(editButton).toBeFalsy();
        const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete"]'));
        expect(deleteButton).toBeFalsy();
      });
    });
  });
});
