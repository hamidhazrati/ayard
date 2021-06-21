import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CurrencyPricingParameterMap,
  CurrencyPricingParameters,
  CurrencyEntry,
  DateAdjustmentConfig,
  MaturityDateAdjustmentConfig,
} from '@app/features/contracts/models/contract.model';
import { CurrencyService } from '@app/services/currency/currency.service';
import { Currency, ReferenceRate } from '@app/services/currency/currency.model';
import { Observable } from 'rxjs';
import { positiveNumber } from '@app/shared/validators/positive-number.validator';
import { map, startWith, tap } from 'rxjs/operators';
import { FormGroup, Control, FormBuilder, Validators } from '@ng-stack/forms';
import { KeyValue } from '@angular/common';
import {
  RangeValue,
  RangeValidator,
  AmountRangeValidator,
  AmountRangeValue,
} from '@app/shared/validators/range.validator';
import { FormControl } from '@angular/forms';

export const MATURITY_DATE_BUFFER_DAYS_MIN_VALUE = 0;

export type CurrencyDialogParams = {
  currency?: CurrencyEntry;
  currencies: CurrencyPricingParameterMap;
};

export interface CurrencyFields {
  referenceRateType: string;
  dayCountConvention: string;
  decimals: number;
  amountRange: AmountRangeValue;
  paymentDate: DateAdjustmentConfig;
  acceptanceDate: DateAdjustmentConfig;
  maturityDate: MaturityDateAdjustmentConfig;
}

@Component({
  selector: 'app-currency-pricing',
  templateUrl: './currency-pricing.component.html',
  styleUrls: ['./currency-pricing.component.scss'],
})
export class CurrencyPricingComponent implements OnInit {
  currencies$: Observable<Currency[]>;
  currencyReferenceRates: ReferenceRate[] = [];
  autocompleteCurrencyControl = new FormControl();
  filteredOptions: Observable<Currency[]>;

  form: FormGroup<
    {
      currency: Control<Currency>;
    } & CurrencyFields
  >;
  editing: boolean;

  paymentDateAdjustmentTypes: KeyValue<string, string>[] = [
    { key: 'BUSINESS_FOLLOWING', value: 'Business Following' },
    { key: 'END_OF_MONTH', value: 'End of Month' },
    { key: 'DAY_OF_WEEK_ADJUSTMENT', value: 'Friday Following Business Preceding' },
  ];

  acceptanceDateAdjustmentTypes: KeyValue<string, string>[] = [
    { key: 'BUSINESS_FOLLOWING', value: 'Business Following' },
    { key: 'END_OF_MONTH', value: 'End of Month' },
  ];

  maturityDateAdjustmentTypes: KeyValue<string, string>[] = [
    { key: 'BUSINESS_FOLLOWING', value: 'Business Following' },
    { key: 'BUSINESS_PRECEDING', value: 'Business Preceding' },
    { key: 'MODIFIED_FOLLOWING', value: 'Modified Following' },
    { key: 'MODIFIED_FOLLOWING_BI_MONTHLY', value: 'Modified Following Bi-Monthly' },
    { key: 'END_OF_MONTH', value: 'End of Month' },
    { key: 'DAY_OF_WEEK_ADJUSTMENT', value: 'Friday Following Business Preceding' },
  ];
  currencies: Currency[];

  maturityDateSetDaySelectOptions: KeyValue<number, number>[] = [];

  ngOnInit(): void {
    this.filteredOptions = this.autocompleteCurrencyControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );

    for (let i = 1; i <= 31; i++) {
      this.maturityDateSetDaySelectOptions.push({ key: i, value: i });
    }
  }

  private _filter(value: any): Currency[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value.code.toLowerCase();
      this.form.controls.currency.setValue(value);
      this.autocompleteCurrencyControl.setValue(value.code);
      return null;
    }
    return this.currencies.filter((option) => option.code.toLowerCase().includes(filterValue));
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    {
      currency: editingCurrency,
      currencies: existingCurrencies = {},
    }: {
      currency?: CurrencyPricingParameters & { currencyCode: string };
      currencies: CurrencyPricingParameterMap;
    },
    public dialogRef: MatDialogRef<
      CurrencyPricingComponent,
      (CurrencyPricingParameters & { currencyCode: string }) | undefined
    >,
    private currencyService: CurrencyService,
    private formBuilder: FormBuilder,
  ) {
    this.editing = !!editingCurrency;

    this.form = formBuilder.group({
      currency: this.formBuilder.control<Control<Currency>>(
        editingCurrency?.currencyCode
          ? ({ code: editingCurrency.currencyCode } as Control<Currency>)
          : null,
      ),
      decimals: this.formBuilder.control(editingCurrency?.decimals, Validators.required),
      dayCountConvention: this.formBuilder.control(
        editingCurrency?.dayCountConvention,
        Validators.required,
      ),
      referenceRateType: this.formBuilder.control(
        editingCurrency?.referenceRateType,
        Validators.required,
      ),
      amountRange: formBuilder.group<AmountRangeValue>(
        {
          cashflowAmountRange: formBuilder.group<RangeValue>(
            {
              min: formBuilder.control<number>(
                { value: editingCurrency?.minCashflowAmount, disabled: false },
                Validators.compose([positiveNumber]),
              ),
              max: formBuilder.control<number>(
                { value: editingCurrency?.maxCashflowAmount, disabled: false },
                Validators.compose([positiveNumber]),
              ),
            },
            {
              validator: Validators.compose([RangeValidator]),
              asyncValidator: Validators.composeAsync([]),
            },
          ),
          paymentAmountRange: formBuilder.group<RangeValue>(
            {
              min: formBuilder.control<number>(
                { value: editingCurrency?.minPaymentAmount, disabled: false },
                Validators.compose([positiveNumber]),
              ),
              max: formBuilder.control<number>(
                { value: editingCurrency?.maxPaymentAmount, disabled: false },
                Validators.compose([positiveNumber]),
              ),
            },
            {
              validator: Validators.compose([RangeValidator]),
              asyncValidator: Validators.composeAsync([]),
            },
          ),
        },
        {
          validator: Validators.compose([AmountRangeValidator]),
          asyncValidator: Validators.composeAsync([]),
        },
      ),
      paymentDate: this.formBuilder.group({
        calendars: this.formBuilder.control(
          editingCurrency?.paymentDate.calendars,
          Validators.required,
        ) as any,
        adjustmentType: this.formBuilder.control(
          editingCurrency?.paymentDate.adjustmentType || this.paymentDateAdjustmentTypes[0].key,
          Validators.required,
        ),
      }),
      acceptanceDate: this.formBuilder.group({
        calendars: this.formBuilder.control(
          editingCurrency?.acceptanceDate.calendars,
          Validators.required,
        ) as any,
        adjustmentType: this.formBuilder.control(
          editingCurrency?.acceptanceDate.adjustmentType ||
            this.acceptanceDateAdjustmentTypes[0].key,
          Validators.required,
        ),
      }),

      maturityDate: this.formBuilder.group({
        calendars: this.formBuilder.control(
          editingCurrency?.maturityDate.calendars,
          Validators.required,
        ) as any,
        adjustmentType: this.formBuilder.control(
          editingCurrency?.maturityDate.adjustmentType || this.maturityDateAdjustmentTypes[0].key,
          Validators.required,
        ),
        bufferDays: this.formBuilder.control<number>(
          editingCurrency?.maturityDate.bufferDays,
          Validators.min(MATURITY_DATE_BUFFER_DAYS_MIN_VALUE),
        ),
        setDay: this.formBuilder.control<number>(editingCurrency?.maturityDate.setDay),
      }),
    });

    this.currencies$ = currencyService.getCurrencies().pipe(
      tap((currencies) => {
        this.currencies = currencies;
        if (!editingCurrency) {
          return;
        }

        this.form.controls.currency.setValue(
          currencies.find((c) => c.code === editingCurrency.currencyCode),
        );
      }),

      map((currencies) => {
        const existingCodes = Object.keys(existingCurrencies);
        return currencies.filter(
          ({ code }) => editingCurrency?.currencyCode === code || !existingCodes.includes(code),
        );
      }),
    );

    this.form.controls.currency.valueChanges.subscribe((v) => {
      this.updateReferenceRates(v.code);
      this.form.controls.decimals.reset(v.decimalPlaces);
      this.form.controls.dayCountConvention.reset(v.dayCountConventionCode);
      this.form.controls.referenceRateType.reset(editingCurrency?.referenceRateType);
      this.form.controls.amountRange.controls.cashflowAmountRange.controls.min.reset(
        editingCurrency?.minCashflowAmount,
      );
      this.form.controls.amountRange.controls.cashflowAmountRange.controls.max.reset(
        editingCurrency?.maxCashflowAmount,
      );
      this.form.controls.amountRange.controls.paymentAmountRange.controls.min.reset(
        editingCurrency?.minPaymentAmount,
      );
      this.form.controls.amountRange.controls.paymentAmountRange.controls.max.reset(
        editingCurrency?.maxPaymentAmount,
      );
    });

    if (editingCurrency?.currencyCode) {
      this.updateReferenceRates(editingCurrency?.currencyCode);
    }
  }

  updateReferenceRates(currencyCode: string) {
    this.currencyService.getCurrencyReferenceRates(currencyCode).subscribe((r) => {
      this.currencyReferenceRates = r;
    });
  }

  handleSubmit() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const value = this.form.value;
    const currency = {
      referenceRateType: value.referenceRateType,
      dayCountConvention: value.dayCountConvention,
      decimals: value.decimals,
      minCashflowAmount: value.amountRange.cashflowAmountRange.min,
      maxCashflowAmount: value.amountRange.cashflowAmountRange.max,
      minPaymentAmount: value.amountRange.paymentAmountRange.min,
      maxPaymentAmount: value.amountRange.paymentAmountRange.max,
      currencyCode: value.currency.code,
      paymentDate: value.paymentDate,
      acceptanceDate: value.acceptanceDate,
      maturityDate: value.maturityDate,
    };

    this.dialogRef.close(currency);
  }
}
