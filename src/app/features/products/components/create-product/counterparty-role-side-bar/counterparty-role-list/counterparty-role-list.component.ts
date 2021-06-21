import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { first } from 'rxjs/operators';
import { CounterpartyRoleService } from '@app/features/counterparty-roles/services/counterparty-role.service';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

@Component({
  selector: 'app-counterparty-role-list',
  templateUrl: './counterparty-role-list.component.html',
  styleUrls: ['./counterparty-role-list.component.scss'],
})
export class CounterpartyRoleListComponent implements OnInit, OnChanges {
  @Input()
  selectedOptions: ProductCounterpartyRole[] = [];

  options: CounterpartyRole[] = [];

  @Output()
  selectOption = new EventEmitter<CounterpartyRole>();

  constructor(private counterpartyRoleService: CounterpartyRoleService) {}

  ngOnInit() {
    this.counterpartyRoleService
      .getCounterpartyRoles()
      .pipe(first())
      .subscribe((v) => {
        this.updateOptions(v, this.selectedOptions);
      });
  }

  selectionChanged(selected: CounterpartyRole) {
    this.selectOption.emit(selected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedOptions = (changes?.selectedOptions?.currentValue ||
      this.selectedOptions) as ProductCounterpartyRole[];

    this.updateOptions(this.options, selectedOptions);
  }

  private updateOptions(options: CounterpartyRole[], selectedOptions: ProductCounterpartyRole[]) {
    const selectedIdentifiers = selectedOptions.map((option) => option.name);

    this.options = options.filter(
      ({ name }) => !selectedIdentifiers.find((selectedName) => selectedName === name),
    );
  }
}
