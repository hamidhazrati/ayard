import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export const extractErrors = (c: AbstractControl) => {
  if (c instanceof FormGroup || c instanceof FormArray) {
    return Object.entries(c.controls).reduce((acc, [key, control]) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        const nested = extractErrors(control);

        if (!Object.keys(nested).length) {
          return acc;
        }

        return {
          ...acc,
          [key]: nested,
        };
      }

      if (!control.errors) {
        return acc;
      }

      return {
        ...acc,
        [key]: control.errors,
      };
    }, {});
  }
};
