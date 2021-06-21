import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Control, FormArray } from '@ng-stack/forms';
import { SubForm } from '@app/shared/form/sub-form';
import { Entity } from '@entities/models/entity.model';
import { Subscription } from 'rxjs';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';

type CounterpartyEntityControl = {
  productCounterpartyRole: Control<ProductCounterpartyRole>;
  entity: Control<Entity>;
  reference: string;
};

@Component({
  selector: 'app-counterparty-form',
  templateUrl: './counterparty-form.component.html',
  styleUrls: ['./counterparty-form.component.scss'],
})
export class CounterpartyFormComponent implements OnInit, OnDestroy, SubForm {
  @Input()
  index = 0;

  @Input()
  productCounterpartyRole: ProductCounterpartyRole;

  counterpartyCustomErrorMessages = {
    cannotContainDuplicates: ({}) => 'Duplicate entities are not allowed for this role.',
    requiredAtLeastOne: ({}) => 'At least one entity is required for this role.',
  };

  private subscriptions: Subscription[] = [];

  form: FormArray<CounterpartyEntityControl>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = new FormArray([]);
    this.onAddEntity();
    if (this.productCounterpartyRole.required) {
      this.form.setValidators([this.duplicateEntityValidator.bind(this)]);
    } else {
      this.form.setValidators(this.duplicateEntityValidator.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  register(control: FormArray) {
    const existing = control.at(this.index);
    if (existing === this.form) {
      return;
    }
    control.setControl(this.index, this.form);
  }

  onAddEntity() {
    const control = this.formBuilder.group<CounterpartyEntityControl>({
      productCounterpartyRole: this.formBuilder.control<ProductCounterpartyRole>(
        this.productCounterpartyRole,
      ),
      entity: this.formBuilder.control<Entity>(null),
      reference: this.formBuilder.control<string>(null),
    });

    this.form.controls.push(control);
    this.subscriptions.push(
      control.controls.entity.valueChanges.subscribe(() => {
        setTimeout(() => {
          // timeout needed otherwise the underlying control hasn't updated its form validity and value properly
          this.form.updateValueAndValidity();
          this.form.markAsTouched();
        });
      }),

      control.controls.reference.valueChanges.subscribe(() => {
        setTimeout(() => {
          // timeout needed otherwise the underlying control hasn't updated its form validity and value properly
          this.form.updateValueAndValidity();
          this.form.markAsTouched();
        });
      }),
    );
  }

  onRemoveEntity(index: number) {
    this.form.removeAt(index);
    this.form.markAsTouched();
  }

  duplicateEntityValidator(): { [s: string]: boolean } {
    const entityValues = this.form.value.filter((entityCtl) => entityCtl.entity);
    const hasDuplicates =
      new Set(entityValues.map((entityCtl) => entityCtl.entity.id)).size !== entityValues.length;
    return hasDuplicates ? { cannotContainDuplicates: true } : null;
  }

  requiredAtLeastOneValueValidator(): { [s: string]: boolean } {
    const anyMatched = this.form.value.filter((entityCtl) => entityCtl.entity).length > 0;
    return !anyMatched ? { requiredAtLeastOne: true } : null;
  }
}
