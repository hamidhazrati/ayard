import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators, FormControl, FormGroup } from '@ng-stack/forms';
import { HttpEventType } from '@angular/common/http';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface DialogData {
  clients: string[];
}

export interface UploadCashflow {
  client: string;
  cashflowFile: FormData;
}

@Component({
  selector: 'app-upload-cashflow-dialog',
  templateUrl: './upload-cashflow-dialog.component.html',
  styleUrls: ['./upload-cashflow-dialog.component.scss'],
})
export class UploadCashflowDialogComponent implements OnInit {
  form: FormGroup<UploadCashflow>;
  selectedFile: File;
  progress: number;
  fileUploaded: boolean;
  uploadSuccess: boolean;
  uploadErrorMessage: string;
  public fileInputDisabled = true;
  public filteredOptions: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<UploadCashflowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cashflowDataService: CashflowDataService,
  ) {
    this.form = new FormGroup({
      client: new FormControl(null, Validators.required),
      cashflowFile: new FormControl(null, Validators.required),
    });

    this.progress = 0;
    this.uploadSuccess = false;
    this.fileUploaded = false;
    this.uploadErrorMessage = '';
  }

  ngOnInit() {
    this.filteredOptions = this.form.controls.client.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue: string = value.toLowerCase();
    const lowerCaseClients: string[] = this.data.clients.map((client: string) =>
      client.toLowerCase(),
    );

    if (!lowerCaseClients.includes(filterValue)) {
      this.fileInputDisabled = true;
    }

    return this.data.clients.filter(
      (option: string) => option.toLowerCase().indexOf(filterValue) === 0,
    );
  }

  onSelect(files: File[]): void {
    this.selectedFile = files[0];
  }

  upload(): void {
    const clientName = this.form.controls.client.value;
    const file = this.selectedFile;

    if (clientName && file) {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('file', file);

      this.cashflowDataService.uploadCashflowFile(formData).subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.ResponseHeader:
              if (event.ok) {
                this.uploadSuccess = true;
              } else if (event.status === 409) {
                this.uploadErrorMessage = 'The file is a duplicate';
              } else {
                this.uploadErrorMessage =
                  'There was an error processing the file. Please try again later';
              }

              this.fileUploaded = true;

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

  public onOptionSelected(): void {
    this.fileInputDisabled = false;
  }

  close(): void {
    this.fileInputDisabled = true;
    this.dialogRef.close();
  }
}
