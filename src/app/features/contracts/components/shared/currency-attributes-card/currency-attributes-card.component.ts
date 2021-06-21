import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyEntry } from '@app/features/contracts/models/contract.model';

@Component({
  selector: 'app-currency-attributes-card',
  templateUrl: './currency-attributes-card.component.html',
  styleUrls: ['./currency-attributes-card.component.scss'],
})
export class CurrencyAttributesCardComponent {
  @Input()
  readonly = false;

  @Input()
  currencyEntry: CurrencyEntry;

  @Output()
  editCurrency = new EventEmitter<CurrencyEntry>();

  @Output()
  deleteCurrency = new EventEmitter<CurrencyEntry>();

  editCurrencyClick() {
    this.editCurrency?.emit({ ...this.currencyEntry });
  }

  removeCurrencyClick() {
    this.deleteCurrency?.emit({ ...this.currencyEntry });
  }
}
