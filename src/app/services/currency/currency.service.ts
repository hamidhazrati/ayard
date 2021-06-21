import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable, of } from 'rxjs';
import { Currency, ReferenceRate } from '@app/services/currency/currency.model';
import { DnbLookup } from '@app/services/dnb/dnb-lookup.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.host}/currencies`).pipe(
      map((messages) =>
        messages.sort((a1: Currency, a2: Currency) => {
          if (a1.code < a2.code) return -1;
          if (a1.code > a2.code) return 1;
          return 0;
        }),
      ),
    );
  }

  getCurrencyReferenceRates(currencyCode: string): Observable<ReferenceRate[]> {
    return this.http.get<ReferenceRate[]>(
      `${this.host}/currencies/${currencyCode}/reference-rates`,
    );
  }
}
