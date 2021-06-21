import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { Dictionary } from 'lodash';
import * as _ from 'lodash';
import { CounterpartiesChangedEvent } from '@app/features/contracts/components/shared/counterparty-list/counterparty-list.component';
import { Contract } from '@app/features/contracts/models/contract.model';
import { AddCounterpartyDialogComponent } from '@app/features/contracts/components/shared/add-counterparty-dialog/add-counterparty-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-counterparty-groups-per-role',
  templateUrl: './counterparty-groups-per-role.component.html',
  styleUrls: ['./counterparty-groups-per-role.component.scss'],
})
export class CounterpartyGroupsPerRoleComponent implements OnInit, OnChanges {
  @Input()
  contract: Contract;
  @Input()
  counterparties: ContractCounterparty[];
  @Input()
  roles: string[];
  @Output()
  counterpartiesChangedEventEmitter: EventEmitter<CounterpartiesChangedEvent> = new EventEmitter<
    CounterpartiesChangedEvent
  >();

  public counterpartiesGroupedByRole: Dictionary<ContractCounterparty[]>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.groupCounterpartiesByRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.counterparties) {
      this.groupCounterpartiesByRole();
    }
  }

  groupCounterpartiesByRole() {
    if (!this.counterparties) {
      this.counterparties = [];
    }
    this.counterpartiesGroupedByRole = _.groupBy<ContractCounterparty>(
      this.counterparties,
      (cp) => cp.role,
    );
  }

  addCounterparty(counterpartyRoleName: string) {
    AddCounterpartyDialogComponent.open(this.dialog, {
      contractId: this.contract.id,
      roleName: counterpartyRoleName,
    }).subscribe(this.counterpartyAdded.bind(this));
  }

  counterpartyAdded(counterparty: ContractCounterparty) {
    if (counterparty) {
      this.counterpartiesChangedEventEmitter.emit({
        action: 'addCounterparty',
        counterparty,
      });
    }
  }
}
