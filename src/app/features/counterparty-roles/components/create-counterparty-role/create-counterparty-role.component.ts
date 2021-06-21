import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounterpartyRoleService } from '../../services/counterparty-role.service';
import { CrumbService } from '../../../../services/crumb/crumb.service';
import { CreateUpdateCounterpartyRole } from '../../models/counterparty.role';
import { createCounterpartyRoleCrumb } from './create-counterparty-role.crumb';

@Component({
  templateUrl: './create-counterparty-role.component.html',
})
export class CreateCounterpartyRoleComponent implements OnInit {
  serverError: string;

  constructor(
    private counterpartyRoleService: CounterpartyRoleService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(createCounterpartyRoleCrumb());
  }

  handleSubmit(role: CreateUpdateCounterpartyRole) {
    this.serverError = null;

    this.counterpartyRoleService.saveCounterpartyRole(role).subscribe(
      (res) => {
        this.router.navigate([`/counterparty-roles/${res.id}`]);
      },
      (error) => {
        if (error.status >= 400 && error.status < 500) {
          this.serverError = error.error.title;
        }
      },
    );
  }
}
