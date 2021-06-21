import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CreateUpdateCounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { TrimFormControl } from '@app/shared/form/trim-form-control';

export const NAME_MAX_LENGTH = 30;
export const DESC_NAME_MAX_LENGTH = 250;

export const ERROR_MESSAGES = {
  'name.required': 'Name is required',
  'name.maxlength': `Maximum length ${NAME_MAX_LENGTH} exceeded`,
  'description.required': 'Description required',
  'description.maxlength': `Maximum length ${DESC_NAME_MAX_LENGTH} exceeded`,
};

@Component({
  selector: 'app-create-counterparty-role-form',
  templateUrl: './create-counterparty-role-form.component.html',
})
export class CreateCounterpartyRoleFormComponent {
  @Output()
  save = new EventEmitter<CreateUpdateCounterpartyRole>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: new TrimFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(NAME_MAX_LENGTH)]),
      ),
      description: new TrimFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(DESC_NAME_MAX_LENGTH)]),
      ),
    });
  }

  getErrorMessage(control: AbstractControl): string {
    const [key] = Object.entries(this.form.controls).find(([_, c]) => {
      return c === control;
    });

    const firstErrorKey = Object.entries(control.errors)
      .filter(([_, hasError]) => hasError)
      .map(([error]) => error)[0];

    const errorKey = `${key}.${firstErrorKey}`;

    return ERROR_MESSAGES[errorKey] || errorKey;
  }

  saveRoleType() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const createUpdateCounterpartyRole: CreateUpdateCounterpartyRole = {
      name: this.valueOrNull(this.form.controls.name.value),
      description: this.valueOrNull(this.form.controls.description.value),
      required: false,
    };

    this.save.emit(createUpdateCounterpartyRole);
  }

  private valueOrNull(value: string): string {
    return value ? value : null;
  }
}
