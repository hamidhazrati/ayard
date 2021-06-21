import { Component, Inject, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

@Component({
  selector: 'app-counterparty-role-side-bar',
  templateUrl: './counterparty-role-side-bar.component.html',
  styleUrls: ['./counterparty-role-side-bar.component.scss'],
})
export class CounterpartyRoleSideBarComponent {
  editing: boolean;
  counterpartyRole?: CounterpartyRole;
  selectedCounterpartyRoles?: CounterpartyRole[] = [];

  @ViewChild('stepper')
  stepper: MatStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: CounterpartyRole | CounterpartyRole[] | undefined,
    public dialogRef: MatDialogRef<CounterpartyRoleSideBarComponent, CounterpartyRole | undefined>,
  ) {
    if (Array.isArray(data)) {
      this.editing = false;
      this.selectedCounterpartyRoles = data;
    } else {
      this.editing = true;
      this.counterpartyRole = data;
    }
  }

  list(): void {
    this.stepper.previous();
  }

  configure(counterpartyRole: CounterpartyRole): void {
    this.counterpartyRole = counterpartyRole;
    this.stepper.next();
  }
}
