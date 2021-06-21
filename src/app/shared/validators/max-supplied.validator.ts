import { AbstractControl } from '@angular/forms';
import { Validators } from '@ng-stack/forms';

export const maxSupplied = (supplier: () => number | undefined | null) => {
  return (control: AbstractControl) => {
    return Validators.max(supplier())(control);
  };
};
