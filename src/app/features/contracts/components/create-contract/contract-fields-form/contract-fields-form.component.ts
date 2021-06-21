import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { Contract, ContractStatus } from '@app/features/contracts/models/contract.model';
import { ContractFields } from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields.model';
import { SubForm } from '@app/shared/form/sub-form';
import { FormErrorComponent } from '@app/shared/components/form-error/form-error.component';

interface ContractStatusAndDescription {
  code: ContractStatus;
  description: string;
}

export const CONTRACT_NAME_MAX_LENGTH = 100;

@Component({
  selector: 'app-contract-fields',
  templateUrl: './contract-fields-form.component.html',
})
export class ContractFieldsFormComponent implements OnInit, SubForm {
  @Input()
  contract?: Contract;

  contractStatuses: ContractStatusAndDescription[] = [
    { code: 'PENDING_APPROVAL', description: 'Pending Approval' },
  ];

  form: FormGroup<ContractFields>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group<ContractFields>({
      name: this.formBuilder.control(
        this.contract?.name,
        Validators.compose([
          Validators.required,
          FormErrorComponent.cannotBeEmpty,
          Validators.maxLength(CONTRACT_NAME_MAX_LENGTH),
        ]),
      ),
      status: this.formBuilder.control(this.contractStatuses[0].code, Validators.required),
    });
  }

  register(control: FormGroup) {
    control.setControl('contractFields', this.form);
  }
}
