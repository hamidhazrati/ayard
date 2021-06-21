import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AuthService } from '@app/auth/auth-service';
import { ContractCounterparty } from '../../../models/counterparty.model';
import { Contract } from '@app/features/contracts/models/contract.model';
import { EditCounterpartyMarginDialogComponent } from '@app/features/contracts/components/shared/edit-counterparty-margin-dialog/edit-counterparty-margin-dialog.component';
import { EditCounterpartyReferencesDialogComponent } from '@app/features/contracts/components/shared/edit-counterparty-references-dialog/edit-counterparty-references-dialog.component';
import { AddLimitDialogComponent } from '@app/features/contracts/components/shared/add-limit-dialog/add-limit-dialog.component';
import { CreditApprovalDialogComponent } from '@app/features/contracts/components/shared/credit-approval-dialog/credit-approval-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { ManageCounterpartyBanksComponent } from '@app/features/contracts/components/shared/manage-counterparty-banks/manage-counterparty-banks.component';

export type CounterpartyAction =
  | 'setMargin'
  | 'deleteCounterparty'
  | 'addCounterparty'
  | 'editReferences'
  | 'addLimit'
  | 'creditApprove'
  | 'manageBankDetails';

export interface CounterpartiesChangedEvent {
  action: CounterpartyAction;
  counterparty: ContractCounterparty;
}

@Component({
  selector: 'app-counterparty-list',
  templateUrl: './counterparty-list.component.html',
  styleUrls: ['./counterparty-list.component.scss'],
})
export class CounterpartyListComponent implements OnInit {
  displayColumns = ['name', 'reference', 'exceptions', 'margin', 'state', 'options'];

  isActive = true;

  public hasFacilityWriteAccess = false;

  invalidPermissionMsg = this.authService.invalidPermissionMsg;

  @Input()
  contract: Contract;

  @Input()
  counterparties: ContractCounterparty[];

  @Output()
  counterpartiesChangedEventEmitter: EventEmitter<CounterpartiesChangedEvent> = new EventEmitter<
    CounterpartiesChangedEvent
  >();

  constructor(
    private authService: AuthService,
    private contractService: ContractService,
    private clipboard: Clipboard,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.checkFacilitiesWriteAccess();
    this.isActive = this.contract.status !== 'PENDING_APPROVAL';
  }

  public checkFacilitiesWriteAccess(): void {
    this.authService
      .isAuthorised('facilities:write')
      .then((isAuthorised) => (this.hasFacilityWriteAccess = isAuthorised));
  }

  counterpartyHasException(counterparty: ContractCounterparty, exceptionCode: string): boolean {
    return counterparty.exceptions?.some((e) => e.code === exceptionCode);
  }

  canAddLimit(counterparty: ContractCounterparty) {
    return this.counterpartyHasException(counterparty, 'LIMIT_REQUIREMENTS_NOT_MET');
  }

  canCreditApprove(counterparty: ContractCounterparty) {
    return this.counterpartyHasException(counterparty, 'CREDIT_APPROVAL_REQUIRED');
  }

  onAction(action: CounterpartyAction, counterparty: ContractCounterparty) {
    this.counterpartyActionSelected(counterparty, action).subscribe(() => {
      this.counterpartiesChangedEventEmitter.emit({
        action,
        counterparty,
      });
    });
  }

  copyToClipboard(counterparty: ContractCounterparty) {
    this.clipboard.copy(counterparty.id);
  }

  counterpartyActionSelected(counterparty: ContractCounterparty, action: string): Observable<any> {
    switch (action) {
      case 'setMargin':
        return EditCounterpartyMarginDialogComponent.open(this.dialog, counterparty);

      case 'editReferences':
        return EditCounterpartyReferencesDialogComponent.open(this.dialog, counterparty);

      case 'addLimit':
        return AddLimitDialogComponent.open(this.dialog, {
          contract: this.contract,
          counterparty,
          limitRequirements: this.contract.roles[counterparty.role]?.limitRequirements,
        });

      case 'manageBankDetails':
        return ManageCounterpartyBanksComponent.open(this.dialog, counterparty);

      case 'creditApprove':
        return CreditApprovalDialogComponent.open(this.dialog, {
          contract: this.contract,
          counterparty,
        });

      case 'deleteCounterparty':
        return this.contractService.deleteCounterparty(counterparty);
    }
  }

  hasCurrenciesInContract(): boolean {
    return this.contract.currencies && Object.keys(this.contract.currencies).length > 0;
  }
}
