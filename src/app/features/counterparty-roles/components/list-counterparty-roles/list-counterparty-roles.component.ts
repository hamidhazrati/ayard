import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CounterpartyRole } from '../../models/counterparty.role';
import { CrumbService } from '../../../../services/crumb/crumb.service';
import { CounterpartyRoleService } from '../../services/counterparty-role.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { counterPartyRolesCrumb } from '../../counter-party-roles.crumb';

@Component({
  templateUrl: './list-counterparty-roles.component.html',
})
export class ListCounterpartyRolesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description'];
  counterpartyRoles: CounterpartyRole[];
  loading = false;
  searchValue = '';
  searchValueChanged: Subject<string> = new Subject<string>();

  constructor(
    private counterpartyRoleService: CounterpartyRoleService,
    private crumbService: CrumbService,
  ) {
    this.searchValueChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged(),
      ) // only emit if value is different from previous value
      .subscribe((searchValue) => {
        const searchTerm: string = searchValue.length > 3 ? searchValue : null;
        this.refresh(searchTerm);
      });
  }

  ngOnInit(): void {
    this.crumbService.setCrumbs(counterPartyRolesCrumb());
    this.refresh(null);
  }

  refresh(searchTerm: string) {
    this.loading = true;
    this.counterpartyRoleService
      .getCounterpartyRoles(searchTerm)
      .subscribe((data: CounterpartyRole[]) => {
        this.counterpartyRoles = [];
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        this.counterpartyRoles.push(...data);
        this.loading = false;
      });
  }

  checkSearchField(value) {
    this.searchValueChanged.next(value);
  }
}
