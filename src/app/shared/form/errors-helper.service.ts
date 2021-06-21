import { AbstractControl, FormGroup } from '@angular/forms';
import { ControlsHelper } from '@app/shared/form/controls-helper.service';
import { Injectable } from '@angular/core';

/**
 * @deprecated use <app-form-error>
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorsHelperService {
  constructor(private controlsHelper: ControlsHelper) {}

  public getErrorMessage(control: AbstractControl, form: FormGroup, errorMessages: any): string {
    const key: string = this.controlsHelper.findControlKey(form, control);

    const firstErrorKey: string = Object.entries(control.errors)
      .filter(([_, hasError]) => hasError)
      .map(([error]) => error)[0];

    const errorKey = `${key}.${firstErrorKey}`;

    return errorMessages[errorKey] || errorKey;
  }
}
