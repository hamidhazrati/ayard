import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  entityOneName: string;
  entityTwoName: string;
  documentReference: string;
  currency: string;
  originalValue: string;
  reason: string;
  isCancelled: boolean;
}

@Component({
  selector: 'app-unaccepted-cashflow-dialogue',
  templateUrl: './unaccepted-cashflow-dialogue.component.html',
  styleUrls: ['./unaccepted-cashflow-dialogue.component.scss'],
})
export class UnacceptedCashflowDialogueComponent implements OnInit {
  constructor(
    public readonly dialogRef: MatDialogRef<UnacceptedCashflowDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.data.isCancelled = false;
  }

  cancel(): void {
    this.data.isCancelled = true;
    this.dialogRef.close(this.data);
  }
}
