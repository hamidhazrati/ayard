import { fakeAsync, tick } from '@angular/core/testing';
import { serviceValidator } from '@app/shared/validators/service.validator';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

describe('createServiceAsyncValidatorFn', () => {
  const serviceFn = (value: string) => of(value.toUpperCase() === 'TRUE');
  let formControl: FormControl;

  beforeEach(() => {
    const asyncValidatorFn = serviceValidator('test', serviceFn);
    formControl = new FormControl('', undefined, asyncValidatorFn);
  });

  it('should be valid when unchanged', fakeAsync(() => {
    expect(formControl.getError('test')).toBeFalsy();
  }));

  it('should add error when service returns invalid', fakeAsync(() => {
    formControl.setValue('false');

    tick(299);
    expect(formControl.getError('test')).toBeFalsy();
    tick(1);
    expect(formControl.getError('test')).toBeTruthy();
  }));

  it('should not add error when service returns valid', fakeAsync(() => {
    tick(299);
    expect(formControl.getError('test')).toBeFalsy();
    tick(1);
    expect(formControl.getError('test')).toBeFalsy();
  }));

  it('should debounce service call correctly', fakeAsync(() => {
    const spyServiceFn = jest.fn(serviceFn);
    const asyncValidatorFn = serviceValidator('test', spyServiceFn);
    formControl = new FormControl('', undefined, asyncValidatorFn);

    formControl.setValue('true');
    tick(299);
    expect(formControl.getError('test')).toBeFalsy();
    expect(spyServiceFn).not.toHaveBeenCalled();
    formControl.setValue('true');
    tick(1);
    expect(spyServiceFn).not.toHaveBeenCalled();
    tick(300);
    expect(spyServiceFn).toHaveBeenCalledWith('true');
    expect(formControl.getError('test')).toBeFalsy();
  }));
});
