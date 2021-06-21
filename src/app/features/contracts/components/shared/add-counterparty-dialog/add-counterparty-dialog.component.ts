import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { BasicCounterpartyFormComponent } from '../basic-counterparty-form/basic-counterparty-form.component';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import {
  CreatedCounterparty,
  CreateUpdateCounterparty,
} from '@app/features/contracts/models/counterparty.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export class AddCounterpartyDialogData {
  contractId: string;
  roleName: string;
}

const duplicateErrorMessages = {
  entityId: 'Duplicate Entity',
  counterpartyReference: 'Duplicate Reference',
  references: 'Duplicate in References',
};

@Component({
  selector: 'app-add-counterparty-dialog',
  templateUrl: './add-counterparty-dialog.component.html',
})
export class AddCounterpartyDialogComponent {
  @ViewChild('counterPartyForm')
  counterPartyForm: BasicCounterpartyFormComponent;

  serverError: string;

  static open(
    dialog: MatDialog,
    data: AddCounterpartyDialogData,
  ): Observable<CreatedCounterparty | undefined> {
    return dialog
      .open<AddCounterpartyDialogComponent, AddCounterpartyDialogData, CreatedCounterparty>(
        AddCounterpartyDialogComponent,
        {
          data,
          width: '800px',
        },
      )
      .afterClosed();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: AddCounterpartyDialogData,
    private dialogRef: MatDialogRef<AddCounterpartyDialogComponent>,
    private counterPartyService: CounterpartyService,
  ) {}

  private setDetailedError(error) {
    Object.getOwnPropertyNames(duplicateErrorMessages).forEach((field) => {
      error.details?.forEach((element) => {
        if (element.target?.indexOf(field) > -1) {
          this.serverError = duplicateErrorMessages[field];
        }
      });
    });
  }

  addCounterParty() {
    if (!this.counterPartyForm.form.valid) {
      return;
    }

    const formValue = this.counterPartyForm.form.value;

    const counterparty: CreateUpdateCounterparty = {
      role: this.data.roleName,
      contractId: this.data.contractId,
      name: formValue.name,
      entityId: formValue.entity.id,
      counterpartyReference: formValue.reference,
      references: formValue.references,
      countryOfOperation: '',
    };

    this.counterPartyService.saveCounterparty(counterparty).subscribe(
      (createdCounterparty) => {
        this.dialogRef.close(createdCounterparty);
      },
      (httpError: HttpErrorResponse) => {
        switch (httpError.status) {
          case 409:
            const error = httpError.error;
            this.serverError = error.title;
            this.setDetailedError(error);
        }
      },
    );
  }
}
