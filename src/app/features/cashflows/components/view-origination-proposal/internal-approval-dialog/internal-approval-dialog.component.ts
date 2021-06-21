import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CashflowService } from '@cashflows/services/cashflow.service';

@Component({
  selector: 'app-internal-approval-dialog',
  templateUrl: './internal-approval-dialog.component.html',
  styleUrls: ['./internal-approval-dialog.component.scss'],
})
export class InternalApprovalDialogComponent {
  constructor(
    private cashflowService: CashflowService,
    private dialogRef: MatDialogRef<InternalApprovalDialogComponent>,
  ) {}

  public confirm(): void {
    this.cashflowService.internalApproval$.next(true);
    this.dialogRef.close();
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
