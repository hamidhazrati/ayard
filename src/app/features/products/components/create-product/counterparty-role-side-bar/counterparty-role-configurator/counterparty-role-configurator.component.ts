import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@ng-stack/forms';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { CounterpartyRoleFormBuilder } from '@app/features/products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import { COUNTERPARTY_ROLE_TYPES_SELECT_OPTIONS } from '@app/features/counterparty-roles/models/counterparty-role-constants';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

@Component({
  selector: 'app-counterparty-role-configurator',
  templateUrl: './counterparty-role-configurator.component.html',
  styleUrls: ['./counterparty-role-configurator.component.scss'],
})
export class CounterpartyRoleConfiguratorComponent implements OnChanges, OnInit {
  counterpartyConstants = {
    roleTypeSelectOptions: COUNTERPARTY_ROLE_TYPES_SELECT_OPTIONS,
  };
  @Output()
  save = new EventEmitter<ProductCounterpartyRole>();

  @Output()
  cancel = new EventEmitter<void>();

  @Input()
  productCounterpartyRole: CounterpartyRole;

  @Input()
  editing: boolean;

  form: FormGroup<ProductCounterpartyRole>;

  constructor(private formBuilder: CounterpartyRoleFormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.buildFormFromCounterpartyRole(this.productCounterpartyRole);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form = this.formBuilder.buildFormFromCounterpartyRole(this.productCounterpartyRole);
  }

  handleSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.save.emit(this.form.value);
  }
}
