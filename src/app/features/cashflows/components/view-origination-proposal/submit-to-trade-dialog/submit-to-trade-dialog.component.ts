import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators, FormControl, FormGroup } from '@ng-stack/forms';
import { HttpEventType } from '@angular/common/http';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { CashflowFile } from '@app/features/cashflows/models';

export interface DialogData {
  cashflowFile: CashflowFile;
}

export interface SubmitToTrade {
  clientRequestLetterFile: FormData;
  proposalFile: FormData;
}

@Component({
  selector: 'app-submit-to-trade-dialog',
  templateUrl: './submit-to-trade-dialog.component.html',
  styleUrls: ['./submit-to-trade-dialog.component.scss'],
})
export class SubmitToTradeDialogComponent {
  form: FormGroup<SubmitToTrade>;
  selectedClientRequestLetter: File;
  selectedProposalFile: File;
  progress: number;
  fileUploaded: boolean;
  uploadSuccess: boolean;
  uploadErrorMessage: string;
  cashflowfile: CashflowFile;

  constructor(
    public dialogRef: MatDialogRef<SubmitToTradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cashflowDataService: CashflowDataService,
  ) {
    this.form = new FormGroup({
      clientRequestLetterFile: new FormControl(null, Validators.required),
      proposalFile: new FormControl(null, Validators.required),
    });

    this.progress = 0;
    this.uploadSuccess = false;
    this.fileUploaded = false;
    this.uploadErrorMessage = '';
    this.cashflowfile = data.cashflowFile;
  }

  onSelectClientRequestLetter(files: File[]): void {
    this.selectedClientRequestLetter = files[0];
  }

  onSelectProposalFile(files: File[]): void {
    this.uploadErrorMessage = '';
    this.selectedProposalFile = files[0];
  }

  upload(): void {
    const clientRequestLetter = this.selectedClientRequestLetter;
    const proposalFile = this.selectedProposalFile;

    if (clientRequestLetter && proposalFile) {
      const formData = new FormData();
      formData.append('clientRequestLetter', clientRequestLetter);
      formData.append('proposalFile', proposalFile);

      this.cashflowDataService.submitToTrade(this.data.cashflowFile.id, formData).subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              if (this.uploadSuccess) {
                this.dialogRef.close(event.body);
              }
              break;
            case HttpEventType.ResponseHeader:
              if (event.ok) {
                this.uploadSuccess = true;
                this.fileUploaded = true;
                this.uploadErrorMessage = '';
              } else if (event.status === 404) {
                this.uploadErrorMessage =
                  'There is a problem finding the details of the download proposal file from the cashflow file';
              } else if (event.status === 409) {
                this.uploadErrorMessage =
                  'File does not match original file sent to client. Please upload original file.';
              } else {
                this.uploadErrorMessage =
                  'There was an error processing the files. Please try again later';
              }

              return event;
          }
        },
        (error) => {
          if (error.status === 400) {
            this.uploadErrorMessage = error.error.title;
          }
        },
      );
    }
  }

  getDownloadFilename(cashflowFile: CashflowFile): string {
    return cashflowFile.exports?.find((cf) => cf.sequence === cashflowFile.latestExport).filename;
  }

  close(): void {
    this.dialogRef.close(this.cashflowfile);
  }
}
