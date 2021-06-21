import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { Control, FormBuilder, FormGroup } from '@ng-stack/forms';
import { Observable } from 'rxjs';

type CounterpartyReferencesForm = {
  references: Control<string[]>;
};

@Component({
  selector: 'app-edit-counterparty-references-dialog',
  templateUrl: './edit-counterparty-references-dialog.component.html',
})
export class EditCounterpartyReferencesDialogComponent implements OnInit {
  serverError: string;
  form: FormGroup<CounterpartyReferencesForm>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public counterparty: ContractCounterparty,
    private dialogRef: MatDialogRef<EditCounterpartyReferencesDialogComponent>,
    private counterPartyService: CounterpartyService,
    private formBuilder: FormBuilder,
  ) {}

  static open(
    dialog: MatDialog,
    counterparty: ContractCounterparty,
  ): Observable<ContractCounterparty | undefined> {
    return dialog
      .open<EditCounterpartyReferencesDialogComponent, ContractCounterparty, ContractCounterparty>(
        EditCounterpartyReferencesDialogComponent,
        {
          data: counterparty,
          width: '800px',
        },
      )
      .afterClosed();
  }

  update() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const references = this.form.value.references;

    this.counterPartyService.updateReferences(this.counterparty.id, references).subscribe(
      (createdCounterparty) => {
        this.dialogRef.close(this.counterparty);
      },
      (httpError: HttpErrorResponse) => {
        switch (httpError.status) {
          case 409:
            this.serverError = 'Duplicate References';
        }
      },
    );
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group<CounterpartyReferencesForm>({
      references: this.formBuilder.control<string[]>(this.counterparty.references),
    });
  }
}
