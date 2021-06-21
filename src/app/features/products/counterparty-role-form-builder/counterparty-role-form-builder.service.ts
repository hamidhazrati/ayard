import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorsModel } from '@ng-stack/forms';
import { serviceValidator } from '../../../shared/utils';
import { TrimFormControl } from '../../../shared/form/trim-form-control';
import { CounterpartyRoleService } from '../../counterparty-roles/services/counterparty-role.service';
import { ProductCounterpartyRole } from '../models/product-counterparty-role.model';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

export const NAME_MAX_LENGTH = 30;
export const DESCRIPTION_MAX_LENGTH = 250;

@Injectable()
export class CounterpartyRoleFormBuilder {
  constructor(
    private formBuilder: FormBuilder,
    private counterpartyRoleService: CounterpartyRoleService,
  ) {}

  public buildFormFromCounterpartyRole(counterpartyRole?: CounterpartyRole) {
    return this.formBuilder.group<ProductCounterpartyRole>({
      name: this.buildNameControl(counterpartyRole?.name, false),
      description: this.buildDescriptionControl(counterpartyRole?.description),
      required: this.formBuilder.control(counterpartyRole?.required || false),
      type: this.formBuilder.control(null, Validators.required),
    });
  }

  public buildFormFromProductCounterpartyRole(counterpartyRole?: ProductCounterpartyRole) {
    return this.formBuilder.group<ProductCounterpartyRole>({
      name: this.buildNameControl(counterpartyRole?.name, false),
      description: this.buildDescriptionControl(counterpartyRole?.description),
      required: this.formBuilder.control(counterpartyRole?.required || false),
      type: this.formBuilder.control(counterpartyRole.type, Validators.required),
    });
  }

  private buildNameControl(
    name: string | undefined,
    isCreateUpdate: boolean,
  ): FormControl<string, ValidatorsModel & { unique: true }> {
    const control = new TrimFormControl<ValidatorsModel & { unique: true }>(
      name || '',
      Validators.compose([Validators.required, Validators.maxLength(NAME_MAX_LENGTH)]),
      serviceValidator('unique', (value) => this.counterpartyRoleService.isUnique(value)),
    );

    if (!isCreateUpdate) {
      control.setAsyncValidators(null);
    }

    return control;
  }

  private buildDescriptionControl(description?: string) {
    return this.formBuilder.control(
      description || '',
      Validators.compose([Validators.required, Validators.maxLength(DESCRIPTION_MAX_LENGTH)]),
    );
  }
}
