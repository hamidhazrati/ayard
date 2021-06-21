import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

/**
 * @deprecated use ng-stack/forms
 */
@Injectable({
  providedIn: 'root',
})
export class ControlsHelper {
  /**
   * @deprecated use ng-stack/forms
   */
  public findControlKey(
    formGroup: FormGroup,
    control: AbstractControl,
    currentKey?: string,
  ): string {
    for (const controlKey of Object.keys(formGroup.controls)) {
      const groupControl = formGroup.controls[controlKey];
      const newKey = currentKey ? currentKey + '.' + controlKey : controlKey;
      if (groupControl === control) {
        return newKey;
      }

      if (groupControl instanceof FormArray) {
        const keyInArray = this.findControlKeyInFormArray(groupControl, control, newKey);
        if (keyInArray) {
          return keyInArray;
        }
      }
    }
  }

  /**
   * @deprecated use ng-stack/forms
   */
  private findControlKeyInFormArray(
    formArray: FormArray,
    control: AbstractControl,
    key: string,
  ): string {
    return formArray.controls
      .filter((c: AbstractControl) => c instanceof FormGroup)
      .map((c: FormGroup) => this.findControlKey(c, control, key))
      .find((k) => {
        return k !== undefined;
      });
  }
}
