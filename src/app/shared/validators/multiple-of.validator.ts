import { ValidatorFn } from '@ng-stack/forms';

const floatSafeRemainder = (val: number, step: number) => {
  const valDecCount = (val.toString().split('.')[1] || '').length;
  const stepDecCount = (step.toString().split('.')[1] || '').length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace('.', ''), 10);
  const stepInt = parseInt(step.toFixed(decCount).replace('.', ''), 10);

  return (valInt % stepInt) / Math.pow(10, decCount);
};

export type MultipleOfError = { multipleOf: { multiple: number; actual: number } };

export const multipleOf = (multiple: number): ValidatorFn<MultipleOfError> => (control) => {
  if (!control.value) {
    return null;
  }

  const mod = floatSafeRemainder(parseFloat(control.value), multiple);

  return mod === 0 ? null : { multipleOf: { multiple, actual: control.value } };
};
