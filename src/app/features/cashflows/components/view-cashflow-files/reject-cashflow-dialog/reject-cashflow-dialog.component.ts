import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@ng-stack/forms';
import { CashflowDataService } from '../../../services/cashflow-data.service';
import { CashflowStatusUpdate } from '../../../models/cashflow-file';

interface DialogData {
  cashflowFileId: string;
}

interface RejectForm {
  reason: string;
}

@Component({
  selector: 'app-reject-cashflow-dialog',
  templateUrl: './reject-cashflow-dialog.component.html',
  styleUrls: ['./reject-cashflow-dialog.component.scss'],
})
export class RejectCashflowDialogComponent {
  form: FormGroup<RejectForm>;
  uploadSuccess: boolean;
  serverError?: string;

  constructor(
    public dialogRef: MatDialogRef<RejectCashflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cashflowDataService: CashflowDataService,
  ) {
    this.form = new FormGroup({
      reason: new FormControl(null, Validators.required),
    });
    this.uploadSuccess = false;
  }

  rejectFile(): void {
    const rejectPayload: CashflowStatusUpdate = {
      status: 'REJECTED',
      message: this.form.controls.reason.value,
      user: 'ops-portal-user',
    };
    this.cashflowDataService
      .updateCashflowStatus(this.data.cashflowFileId, rejectPayload)
      .subscribe(
        (cashflowUpdated) => {
          this.dialogRef.close();
        },
        (error) => {
          this.serverError = 'Unable to reject cashflow file ' + error.statusText;
        },
      );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
