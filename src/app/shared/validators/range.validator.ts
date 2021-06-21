import { FormGroup, ValidatorFn } from '@ng-stack/forms';

export interface RangeValue {
  min: number;
  max: number;
}

export interface AmountRangeValue {
  paymentAmountRange: RangeValue;
  cashflowAmountRange: RangeValue;
}

export const RangeValidator: ValidatorFn = (fg: FormGroup<RangeValue>) => {
  const start = fg.controls.min.value;
  const end = fg.controls.max.value;
  if (start === null || end === null) return null;
  return start < end
    ? null
    : {
        range: {
          min: start,
          max: end,
        },
      };
};

export const AmountRangeValidator: ValidatorFn = (fg: FormGroup<AmountRangeValue>) => {
  const minPayment = fg.controls.paymentAmountRange.controls.min.value;
  const minCashflow = fg.controls.cashflowAmountRange.controls.min.value;
  const maxPayment = fg.controls.paymentAmountRange.controls.max.value;
  const maxCashflow = fg.controls.cashflowAmountRange.controls.max.value;

  let res = null;

  if (!(minPayment === null || minCashflow === null)) {
    if (minPayment < minCashflow) {
      res = {};
      res.min = true;
    }
  }

  if (!(maxPayment === null || maxCashflow === null)) {
    if (maxCashflow > maxPayment) {
      if (res == null) {
        res = {};
      }
      res.max = true;
    }
  }
  return res;
};
