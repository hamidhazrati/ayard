import { FormArray, FormGroup } from '@angular/forms';

export interface SubForm {
  register(control: FormGroup | FormArray);
}
