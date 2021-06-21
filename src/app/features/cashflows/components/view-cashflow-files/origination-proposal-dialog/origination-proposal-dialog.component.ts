import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { CashflowFile, CashflowStatusUpdate } from '@app/features/cashflows/models/cashflow-file';

export interface DialogData {
  cashflowFile: CashflowFile;
}

@Component({
  selector: 'app-origination-proposal-dialog',
  templateUrl: './origination-proposal-dialog.component.html',
  styleUrls: ['./origination-proposal-dialog.component.scss'],
})
export class OriginationProposalDialogComponent {
  public loading = false;
  constructor(
    public dialogRef: MatDialogRef<OriginationProposalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cashflowDataService: CashflowDataService,
  ) {}

  submitForInternalApproval(): void {
    const processingStatus: CashflowStatusUpdate = {
      status: 'AWAITING_INTERNAL_APPROVAL',
    } as CashflowStatusUpdate;
    this.loading = true;
    this.cashflowDataService
      .updateCashflowStatus(this.data.cashflowFile.id, processingStatus)
      .subscribe(() => {
        this.loading = false;
        this.close();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
