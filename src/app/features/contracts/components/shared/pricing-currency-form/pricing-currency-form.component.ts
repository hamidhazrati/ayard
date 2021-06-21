import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Control, FormBuilder } from '@ng-stack/forms';
import {
  CurrencyPricingParameters,
  CurrencyEntry,
  makeCurrencyEntry,
  CurrencyPricingParameterMap,
  makeCurrencyEntries,
} from '@app/features/contracts/models/contract.model';
import {
  CurrencyPricingComponent,
  CurrencyDialogParams,
} from '../../create-contract/currency-pricing/currency-pricing.component';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { SubForm } from '@app/shared/form/sub-form';

export type CurrencyForm = {
  currencies: CurrencyControlMap;
};

type CurrencyControlMap = { [key: string]: Control<CurrencyPricingParameters> };

@Component({
  selector: 'app-pricing-currency-form',
  templateUrl: './pricing-currency-form.component.html',
  styleUrls: ['./pricing-currency-form.component.scss'],
})
export class PricingCurrencyFormComponent implements SubForm, OnInit {
  form: FormGroup<CurrencyForm>;

  @Input()
  readonly = false;

  @Input()
  currencies: CurrencyPricingParameterMap;

  makeCurrencyEntry = makeCurrencyEntry;

  addCurrency = this.openCurrencySidebar.bind(this);
  editCurrency = this.openCurrencySidebar.bind(this);

  constructor(
    private formBuilder: FormBuilder,
    private sideBarDialogService: SideBarDialogService,
  ) {
    this.form = formBuilder.group<CurrencyForm>({
      currencies: formBuilder.group<CurrencyControlMap>({}),
    });
  }

  ngOnInit(): void {
    if (this.currencies) {
      const currencyEntries = makeCurrencyEntries(this.currencies);
      currencyEntries.forEach(this.addUpdateCurrency.bind(this));
    }
  }

  register(control: FormGroup) {
    control.setControl('currenciesForm', this.form);
  }

  removeCurrency(currency: CurrencyEntry) {
    this.form.controls.currencies.removeControl(currency.currencyCode);
  }

  addUpdateCurrency(currency: CurrencyEntry) {
    if (!currency) return;

    this.form.controls.currencies.setControl(
      currency.currencyCode,
      // @ts-ignore
      this.formBuilder.control(currency),
    );
  }

  private openCurrencySidebar(currency?: CurrencyEntry) {
    this.sideBarDialogService
      .open<CurrencyPricingComponent, CurrencyDialogParams, CurrencyEntry>(
        CurrencyPricingComponent,
        { currency, currencies: this.form.value.currencies },
      )
      .afterClosed()
      .subscribe(this.addUpdateCurrency.bind(this));
  }
}
