import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { Control, FormBuilder, FormGroup } from '@ng-stack/forms';
import { Observable } from 'rxjs';

type CounterpartyMarginForm = {
  marginRate: number;
};

@Component({
  selector: 'app-edit-counterparty-margin-dialog',
  templateUrl: './edit-counterparty-margin-dialog.component.html',
})
export class EditCounterpartyMarginDialogComponent implements OnInit {
  serverError: string;
  form: FormGroup<CounterpartyMarginForm>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public counterparty: ContractCounterparty,
    private dialogRef: MatDialogRef<EditCounterpartyMarginDialogComponent>,
    private counterPartyService: CounterpartyService,
    private formBuilder: FormBuilder,
  ) {}

  static open(
    dialog: MatDialog,
    counterparty: ContractCounterparty,
  ): Observable<ContractCounterparty | undefined> {
    return dialog
      .open<EditCounterpartyMarginDialogComponent, ContractCounterparty, ContractCounterparty>(
        EditCounterpartyMarginDialogComponent,
        {
          data: counterparty,
          width: '400px',
        },
      )
      .afterClosed();
  }

  update(counterparty: any) {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    // const bkp = counterparty.marginRate;
    let formMarginRate = this.form.value.marginRate;

    if (formMarginRate === null || isNaN(formMarginRate) || formMarginRate < 0) {
      formMarginRate = null; // cuases reset to parent marginRate
    }

    counterparty.marginRate = formMarginRate;

    this.counterPartyService.updateCounterparty(counterparty).subscribe(
      (resp) => {
        this.dialogRef.close(counterparty);
      },
      (error) => {
        console.log('ERROR: counterPartyService.updateCounterparty', error);
      },
    );
    return;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group<CounterpartyMarginForm>({
      marginRate: this.formBuilder.control<number>(
        this.counterparty.marginRate === this.counterparty.contract?.pricingOperation.spread
          ? null
          : this.counterparty.marginRate,
      ),
    });
  }
}
