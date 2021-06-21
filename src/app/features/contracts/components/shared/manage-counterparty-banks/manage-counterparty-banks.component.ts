import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { GdsColumn, GdsColumnType, SortDirection } from '@greensill/gds-ui/data-table';
import { GdsSorting } from '@greensill/gds-ui/data-table/shared/data-table-types';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ContractCounterparty } from '@app/features/contracts/models/counterparty.model';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { Address, BankAccount, BankRequest, Branch } from '../../../models/counterparty-bank';
import { FormGroup, FormBuilder } from '@ng-stack/forms';
import { Validators } from '@angular/forms';
import { GdsPopOverItem } from '@greensill/gds-ui/data-table/components/data-cell-popover/data-cell-popover.model';

interface Country {
  code: string;
  description: string;
}

@Component({
  selector: 'app-manage-counterparty-banks',
  templateUrl: './manage-counterparty-banks.component.html',
  styleUrls: ['./manage-counterparty-banks.component.scss'],
})
export class ManageCounterpartyBanksComponent implements OnInit {
  countryList: Country[] = [
    { code: 'GB', description: 'United Kingdom' },
    { code: 'US', description: 'USA' },
    { code: 'AU', description: 'Australia' },
  ];
  currencyList: string[] = [];
  form: FormGroup<BankRequest>;
  serverError = '';
  public defaultSorts: GdsSorting[] = [
    {
      prop: 'bankName',
      dir: SortDirection.asc,
    },
  ];
  public sorting: GdsSorting = this.defaultSorts[0];
  public banks: any = [];

  // works with the markup on GDS tables
  //     [popOverItems]="popOverItems"

  popOverItems: GdsPopOverItem[] = [{ label: 'Edit bank details', actionName: 'update_details' }];

  public columns: GdsColumn[] = [
    { prop: 'account.name', name: 'Account name', type: GdsColumnType.TitleCase, columnWidth: 200 },
    { prop: 'bankName', name: 'Bank name', type: GdsColumnType.TitleCase, columnWidth: 200 },
    { prop: 'branch.name', name: 'Branch name', type: GdsColumnType.TitleCase, columnWidth: 200 },
    { prop: 'currency', name: 'Currency', type: GdsColumnType.InnerHTML, columnWidth: 100 },
    { prop: 'account.iban', name: 'IBAN', type: GdsColumnType.InnerHTML, columnWidth: 260 },
  ];

  public action = 'list';
  public titlePrefix = 'Bank details for ';
  bankId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public counterparty: ContractCounterparty,
    private counterpartyService: CounterpartyService,
    private formBuilder: FormBuilder,
  ) {}

  static open(
    dialog: MatDialog,
    counterparty: ContractCounterparty,
  ): Observable<ContractCounterparty | undefined> {
    return dialog
      .open<ManageCounterpartyBanksComponent, ContractCounterparty>(
        ManageCounterpartyBanksComponent,
        {
          data: counterparty,
          width: '1100px',
        },
      )
      .afterClosed();
  }

  ngOnInit(): void {
    this.getBanks();
  }

  initialiseForm(bankDetails?: any) {
    this.form = this.formBuilder.group<BankRequest>({
      currency: this.formBuilder.control<string>(bankDetails?.currency, Validators.required),
      bankName: this.formBuilder.control<string>(bankDetails?.bankName),
      branch: this.formBuilder.group<Branch>({
        name: this.formBuilder.control<string>(bankDetails?.branch?.name),
        address: this.formBuilder.group<Address>({
          line1: this.formBuilder.control<string>(bankDetails?.branch?.address?.line1),
          line2: this.formBuilder.control<string>(bankDetails?.branch?.address?.line2),
          line3: this.formBuilder.control<string>(bankDetails?.branch?.address?.line3),
          line4: this.formBuilder.control<string>(bankDetails?.branch?.address?.line4),
          city: this.formBuilder.control<string>(bankDetails?.branch?.address?.city),
          region: this.formBuilder.control<string>(bankDetails?.branch?.address?.region),
          country: this.formBuilder.control<string>(
            bankDetails?.branch?.address?.country,
            Validators.required,
          ),
          postalCode: this.formBuilder.control<string>(bankDetails?.branch?.address?.postalCode),
        }),
        bic: this.formBuilder.control<string>(bankDetails?.branch?.bic),
        domesticBranchId: this.formBuilder.control<string>(bankDetails?.branch?.domesticBranchId),
      }),
      account: this.formBuilder.group<BankAccount>({
        name: this.formBuilder.control<string>(bankDetails?.account?.name),
        iban: this.formBuilder.control<string>(bankDetails?.account?.iban),
        domesticAccountId: this.formBuilder.control<string>(
          bankDetails?.account?.domesticAccountId,
        ),
      }),
    });
  }

  getBanks() {
    this.action = 'list';
    this.titlePrefix = 'Bank details for';
    this.counterpartyService.getBanks(this.counterparty.id).subscribe((banks) => {
      this.banks = banks;

      const currenciesConfiguredInContract: string[] = Object.keys(
        this.counterparty.contract.currencies,
      );
      const currenciesConfiguredInCounterparty: string[] = banks.map((bank) => bank.currency);
      this.currencyList = currenciesConfiguredInContract.filter(
        (currency) => !currenciesConfiguredInCounterparty.includes(currency),
      );
      console.log(this.currencyList);
    });
  }

  popOverEvent(event: any) {
    this.action = 'update';
    this.titlePrefix = 'Update bank details for';
    this.currencyList = [event.row.currency];
    this.bankId = event.row.id;
    this.initialiseForm(event.row);
    this.resetServerErrors();
  }

  canAddBank(): boolean {
    return this.currencyList.length > 0;
  }

  addBank() {
    this.action = 'add';
    this.titlePrefix = 'Add new bank details for';
    this.initialiseForm();
    this.resetServerErrors();
  }

  cancelAddBank() {
    this.resetServerErrors();
    this.getBanks();
  }

  resetServerErrors() {
    this.serverError = '';
    this.form?.controls?.account.controls?.iban.setErrors(null);
    this.form?.controls?.branch.controls?.bic.setErrors(null);
  }

  saveBank() {
    this.resetServerErrors();
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }
    const bankRequest: BankRequest = this.form.value;
    if (bankRequest.account.iban === '') {
      bankRequest.account.iban = null;
    }
    if (bankRequest.branch.bic === '') {
      bankRequest.branch.bic = null;
    }

    this.counterpartyService.addBank(this.counterparty.id, bankRequest).subscribe(
      (response) => {
        this.getBanks();
      },
      (err) => {
        this.handleServiceError(err);
      },
    );
  }

  updateBank() {
    this.resetServerErrors();
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }
    const bankRequest: BankRequest = this.form.value;
    if (bankRequest.account.iban === '') {
      bankRequest.account.iban = null;
    }
    if (bankRequest.branch.bic === '') {
      bankRequest.branch.bic = null;
    }

    this.counterpartyService.updateBank(this.counterparty.id, this.bankId, bankRequest).subscribe(
      (response) => {
        this.getBanks();
      },
      (err) => {
        this.handleServiceError(err);
      },
    );
  }

  handleServiceError(err: any) {
    if (err.status === 400) {
      if (err.error?.code === 'VALIDATION_ERROR') {
        err.error.details.forEach((el: any) => {
          if (el.target.includes('account.iban')) {
            this.form.controls.account.controls.iban.setErrors({ ['iban']: el.description });
          } else if (el.target.includes('branch.bic')) {
            this.form.controls.branch.controls.bic.setErrors({ ['bic']: el.description });
          }
        });
      } else {
        err.error.forEach((el: any) => {
          this.serverError = this.serverError.concat(el.message);
        });
      }
    } else {
      this.serverError = 'Error from Backend please try again later';
    }
  }
}
