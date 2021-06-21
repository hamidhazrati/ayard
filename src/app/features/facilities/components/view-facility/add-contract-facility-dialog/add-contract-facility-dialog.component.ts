import { Component, Inject, OnInit } from '@angular/core';
import { Control, FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { ContractTotalFacility, Facility } from '@app/features/facilities/models/facility.model';
import { TrimFormControl } from '@app/shared/form/trim-form-control';
import {
  CreateGuarantorLimit,
  CreateTotalLimit,
} from '@app/features/facilities/models/limit.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  createSetCreditLimitFacilityUpdate,
  createSetNameFacilityUpdate,
  FacilityUpdate,
} from '@app/features/facilities/models/facility-update.model';
import {
  AddChildFacilityOperation,
  UpdateFacilityOperation,
} from '@app/features/facilities/models/facility-operate.model';
import { predicateValidator } from '@app/shared/validators/predicate.validator';

const NAME_FIELD_MAX_LENGTH = 60;

export interface AddContractFacilityDialogComponentDialogData {
  parents: Facility[];
  existing?: ContractTotalFacility;
}

@Component({
  selector: 'app-add-contract-facility-dialog-component',
  templateUrl: './add-contract-facility-dialog.component.html',
  styleUrls: ['./add-contract-facility-dialog.component.scss'],
})
export class AddContractFacilityDialogComponent implements OnInit {
  form: FormGroup<{
    parent: Control<Facility>;
    name: string;
    creditLimit?: number;
  }>;

  parents: Facility[];

  existing?: ContractTotalFacility;

  editing: boolean;

  nameCustomErrorMessages = {
    unique: ({}) => 'A facility with that name <b>already exists</b>.',
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<
      AddContractFacilityDialogComponent,
      UpdateFacilityOperation | AddChildFacilityOperation
    >,
    @Inject(MAT_DIALOG_DATA) public data: AddContractFacilityDialogComponentDialogData,
  ) {
    this.parents = data.parents;
    this.existing = data.existing;
    this.editing = !!data.existing;

    const existingCreditLimit = AddContractFacilityDialogComponent.getCreditLimit(this.existing);

    this.form = formBuilder.group({
      parent: formBuilder.control<Control<Facility>>(this.parents[0], Validators.required),
      name: new TrimFormControl(
        data.existing?.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(NAME_FIELD_MAX_LENGTH),
          predicateValidator('unique', (value) => this.isUnique(value)),
        ]),
      ),
      creditLimit: formBuilder.control<number>(existingCreditLimit),
    });
  }

  private static getCreditLimit(facility?: ContractTotalFacility): number | null {
    return facility?.limits.find((l) => l.limitType === 'CREDIT')?.limit || null;
  }

  ngOnInit(): void {}

  handleCancel() {
    this.dialogRef.close();
  }

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const { name, parent, creditLimit } = this.form.value;

    if (this.editing) {
      const updates: FacilityUpdate[] = [];

      if (name !== this.existing.name) {
        updates.push(createSetNameFacilityUpdate(name));
      }

      if (creditLimit !== AddContractFacilityDialogComponent.getCreditLimit(this.existing)) {
        updates.push(createSetCreditLimitFacilityUpdate(creditLimit));
      }

      if (!updates.length) {
        return this.dialogRef.close();
      }

      return this.dialogRef.close({
        type: 'update-facility-operation',
        facilityId: this.existing.id,
        updates,
      });
    }

    const limits: (CreateTotalLimit | CreateGuarantorLimit)[] = [];

    if (creditLimit != null) {
      limits.push({
        type: 'total-limit',
        limitType: 'CREDIT',
        limit: creditLimit,
      });
    }

    this.dialogRef.close({
      type: 'add-child-facility-operation',
      facilityId: parent.id,
      facility: {
        type: 'contract-total-facility',
        currency: parent.currency,
        contracts: [],
        children: [],
        name,
        limits,
      },
    });
  }

  private isUnique(value: string): boolean {
    if (!value) {
      return true;
    }

    const parent = this.form?.value.parent;

    if (!parent) {
      return true;
    }

    return !parent.children
      .filter((c) => c.id !== this.existing?.id)
      .find((c) => {
        return value.localeCompare(c?.name, undefined, { sensitivity: 'base' }) === 0;
      });
  }
}
