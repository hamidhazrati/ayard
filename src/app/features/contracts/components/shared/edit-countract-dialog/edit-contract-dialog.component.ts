import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contract } from '@app/features/contracts/models/contract.model';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { Control, FormBuilder, FormGroup } from '@ng-stack/forms';
import { Observable } from 'rxjs';

type ContractDialogForm = {
  facility: Control<{ name: string; id: string }>;
};

@Component({
  selector: 'app-edit-contract-dialog',
  templateUrl: './edit-contract-dialog.component.html',
})
export class EditContractDialogComponent implements OnInit {
  serverError: string;
  form: FormGroup<ContractDialogForm>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public contract: Contract,
    private dialogRef: MatDialogRef<EditContractDialogComponent>,
    private contractService: ContractService,
    private formBuilder: FormBuilder,
  ) {}

  static open(dialog: MatDialog, contract: Contract): Observable<ContractCounterparty | undefined> {
    return dialog
      .open<EditContractDialogComponent, Contract>(EditContractDialogComponent, {
        data: contract,
        width: '800px',
      })
      .afterClosed();
  }

  updateContract() {
    const bkp = this.contract.facility;
    this.contract.facility = this.form.value.facility;

    this.serverError = '';

    this.contractService.updateContract(this.contract.id, this.contract).subscribe(
      (resp) => {
        this.dialogRef.close(this.contract);
      },
      (err) => {
        this.serverError = 'Failed to update contract.';
        this.contract.facility = bkp;
        console.log('ERR updateContract', err);
      },
    );
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group<ContractDialogForm>({
      facility: null,
    });
  }
}
