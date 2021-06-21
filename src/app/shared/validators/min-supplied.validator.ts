import { AbstractControl } from '@angular/forms';
import { Validators } from '@ng-stack/forms';

export const minSupplied = (supplier: () => number | undefined | null) => {
  return (control: AbstractControl) => {
    return Validators.min(supplier())(control);
  };
};
