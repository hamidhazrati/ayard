import { Component, Input, OnInit } from '@angular/core';
import { CounterpartyRoleTypeCode } from '@app/features/products/models/product-counterparty-role.model';
import { MatDialog } from '@angular/material/dialog';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { Contract } from '@app/features/contracts/models/contract.model';
import { COUNTERPARTY_ROLE_TYPE_LABELS } from '@app/features/products/models/product-counterparty-role.model';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-counterparty-groups-per-role-type-and-role',
  templateUrl: './counterparty-groups-per-role-type-and-role.component.html',
})
export class CounterpartyGroupsPerRoleTypeAndRoleComponent implements OnInit {
  ROLE_TYPE_TABS_IN_ORDER: CounterpartyRoleTypeCode[] = ['PRIMARY', 'RELATED', 'OTHER'];

  @Input()
  contract: Contract;
  counterpartiesGroupedByRoleType: Dictionary<ContractCounterparty[]>;
  counterpartyRoleTypeLabels = COUNTERPARTY_ROLE_TYPE_LABELS;

  loadingCounterparties = false;
  errorMessage: string = null;
  lastTabVistedIndex = 0;
  constructor(private dialog: MatDialog, private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadAndGroupCounterparties();
  }

  loadAndGroupCounterparties() {
    if (this.contract) {
      this.contractService.getContractCounterpartiesById(this.contract.id).subscribe(
        (counterparties) => {
          this.groupCounterpartiesByRoleType(counterparties);
          this.loadingCounterparties = true;
        },
        () => {
          this.loadingCounterparties = false;
          this.errorMessage =
            'Failed to load counterparties, please refresh to see whether the problem persists.';
        },
        () => {
          this.loadingCounterparties = false;
        },
      );
    }
  }

  groupCounterpartiesByRoleType(contractCounterparties: ContractCounterparty[]) {
    this.counterpartiesGroupedByRoleType = _.groupBy<ContractCounterparty>(
      contractCounterparties,
      (counterparty: ContractCounterparty) => counterparty.roleType,
    );
  }

  getUniqueRoles(contractCounterparties: ContractCounterparty[]) {
    return contractCounterparties
      .map((cp) => cp.role)
      .filter((elem, index, self) => index === self.indexOf(elem));
  }
  selectedTabChange(tabChangeEvent: MatTabChangeEvent): void {
    this.lastTabVistedIndex = tabChangeEvent.index;
  }
}
