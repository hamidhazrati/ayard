import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contract } from '@app/features/contracts/models/contract.model';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { Observable } from 'rxjs';

export interface CreditApprovalDialogData {
  contract: Contract;
  counterparty: ContractCounterparty;
}

@Component({
  selector: 'app-credit-approval-dialog',
  templateUrl: './credit-approval-dialog.component.html',
})
export class CreditApprovalDialogComponent {
  static open(dialog: MatDialog, data: CreditApprovalDialogData): Observable<string | undefined> {
    return dialog
      .open<CreditApprovalDialogComponent, CreditApprovalDialogData, string>(
        CreditApprovalDialogComponent,
        {
          data,
          width: '400px',
        },
      )
      .afterClosed();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: CreditApprovalDialogData,
    private dialogRef: MatDialogRef<CreditApprovalDialogComponent>,
    private counterpartyService: CounterpartyService,
  ) {}

  approve() {
    this.counterpartyService
      .updateCreditStatus(this.data.counterparty.id, 'APPROVED')
      .subscribe(() => {
        this.dialogRef.close(this.data.counterparty);
      });
  }

  reject() {
    this.counterpartyService
      .updateCreditStatus(this.data.counterparty.id, 'REJECTED')
      .subscribe(() => {
        this.dialogRef.close(this.data.counterparty);
      });
  }
}
