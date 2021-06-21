import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CashflowFileExport, CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

export interface DialogData {
  cashflowFileId: string;
}

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
})
export class ExportDialogComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  public isDownloading = false;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cashflowDataService: CashflowDataService,
  ) {}

  public saveFile(data: Blob, filename: string) {
    saveAs(data, filename);
  }

  public download(): void {
    this.isDownloading = true;

    this.cashflowDataService
      .downloadCashflowFileExport(this.data.cashflowFileId)
      .pipe(
        take(1),
        takeUntil(this.onDestroy$),
        finalize(() => {
          this.close();
          setTimeout(() => (this.isDownloading = false), 250);
        }),
      )
      .subscribe((response: CashflowFileExport) => {
        this.saveFile(response.data, response.filename);
        this.cashflowDataService.isCashflowFileExported.next(true);
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
