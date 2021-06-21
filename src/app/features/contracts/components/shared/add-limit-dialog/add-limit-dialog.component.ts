import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Contract,
  LimitRequirement,
  LimitRequirements,
} from '@app/features/contracts/models/contract.model';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { Entity } from '@app/features/entities/models/entity.model';
import { EntityService } from '@app/features/entities/services/entity.service';
import { AddCounterpartyLimitOperation } from '@app/features/facilities/models/facility-operate.model';
import { TotalLimit } from '@app/features/facilities/models/limit.model';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { LimitFormValue } from '@app/shared/components/limit-form-field/limit-form-field.component';
import { Observable } from 'rxjs';

export interface AddLimitDialogData {
  contract: Contract;
  counterparty: ContractCounterparty;
  limitRequirements: LimitRequirements;
}

const limitValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  let returnValue = { required: true };

  switch (control.value.source) {
    case 'NAMED':
      const nameLimitValue = control.value.value;

      if (nameLimitValue && nameLimitValue > 0) {
        returnValue = null;
      }
      break;
    case 'DEFAULT':
      returnValue = null;
      break;
  }

  return returnValue;
};

@Component({
  selector: 'app-add-limit-dialog',
  templateUrl: './add-limit-dialog.component.html',
})
export class AddLimitDialogComponent implements OnInit {
  entity: Entity;
  serverError: string;
  form: FormGroup;
  requirements: LimitRequirement[];
  currencyCodes: string[];

  static open(dialog: MatDialog, data: AddLimitDialogData): Observable<string | undefined> {
    return dialog
      .open<AddLimitDialogComponent, AddLimitDialogData, string>(AddLimitDialogComponent, {
        data,
        width: '400px',
      })
      .afterClosed();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: AddLimitDialogData,
    private dialogRef: MatDialogRef<AddLimitDialogComponent>,
    private facilityService: FacilityService,
    private counterpartyService: CounterpartyService,
    private entityService: EntityService,
    private formBuilder: FormBuilder,
  ) {
    this.requirements = this.data.limitRequirements.requirements;
    this.currencyCodes = Object.keys(data.contract.currencies);
  }

  ngOnInit(): void {
    this.entityService.getEntityById(this.data.counterparty.entityId).subscribe((entity) => {
      this.entity = entity;
    });

    this.form = this.formBuilder.group({});

    this.requirements.forEach((limit) => {
      this.form.addControl(
        limit.limitType,
        this.formBuilder.control({ source: limit.validSources[0] }, limitValidator),
      );
    });
  }

  getNamedLimits() {
    return this.requirements.reduce((limits: TotalLimit[], requirement) => {
      const limitFieldValue: LimitFormValue = this.form.value[requirement.limitType];

      if (limitFieldValue.source === 'NAMED') {
        limits.push({
          type: 'total-limit',
          limitType: requirement.limitType,
          limit: limitFieldValue.value,
          defaultLimit: false,
        } as TotalLimit);
      }
      return limits;
    }, []);
  }

  addLimit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const namedLimits = this.getNamedLimits();

    const addLimitOperation: AddCounterpartyLimitOperation = {
      type: 'add-counterparty-limits-operation',
      facilityId: this.data.contract.facility?.id,
      counterpartyRoleType: {
        name: this.data.counterparty.role,
      },
      entityLimits: [
        {
          entity: {
            id: this.entity.id,
            name: this.entity.name,
            dunsNumber: this.entity.dunsNumber,
          },
          limits: namedLimits,
        },
      ],
    };

    this.facilityService.operateFacility(addLimitOperation).subscribe(() => {
      this.counterpartyService.refreshValidationState(this.data.counterparty.id).subscribe(() => {
        this.dialogRef.close(this.data.counterparty);
      });
    });
  }
}
