import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime as debounceTimeFn,
  distinctUntilChanged,
  first,
  map,
  switchMap,
} from 'rxjs/operators';

export type ServiceFn<T> = (value: T) => Observable<boolean>;
export const DEFAULT_DEBOUNCE_TIME = 300;

export function serviceValidator<T = string>(
  validationKey: string,
  serviceFn: ServiceFn<T>,
  debounceTime: number = DEFAULT_DEBOUNCE_TIME,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{}> => {
    if (!control.valueChanges) {
      return of(null);
    } else {
      return control.valueChanges.pipe(
        debounceTimeFn(debounceTime),
        distinctUntilChanged(),
        switchMap((v) =>
          serviceFn(v as T).pipe(
            map((serviceHasReturnedTrue) => {
              control.markAllAsTouched();
              return serviceHasReturnedTrue ? null : { [validationKey]: true };
            }),
          ),
        ),
        first(),
      );
    }
  };
}
