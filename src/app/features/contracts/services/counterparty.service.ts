import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@app/services/config/config.service';
import {
  Counterparty,
  CounterpartyCreditStatus,
  CreatedCounterparty,
  CreateUpdateCounterparty,
} from '@app/features/contracts/models/counterparty.model';
import { BankRequest, Bank, CreatedBank } from '../models/counterparty-bank';

@Injectable({
  providedIn: 'root',
})
export class CounterpartyService {
  private readonly url: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.url = `${this.configService.getApiUrl()}/contract-counterparty`;
  }

  private instanceUrl(counterpartyId: string) {
    return `${this.url}/${counterpartyId}`;
  }

  updateCreditStatus(
    counterpartyId: string,
    creditStatus: CounterpartyCreditStatus,
  ): Observable<any> {
    return this.http.put(`${this.instanceUrl(counterpartyId)}/credit-status`, {
      status: creditStatus,
    });
  }

  saveCounterparty(counterparty: CreateUpdateCounterparty): Observable<CreatedCounterparty> {
    return this.http.post<CreatedCounterparty>(this.url, counterparty);
  }

  updateCounterparty(counterparty: Counterparty): Observable<CreatedCounterparty> {
    return this.http.put<CreatedCounterparty>(this.url + '/' + counterparty.id, counterparty);
  }

  refreshValidationState(counterpartyId: string): Observable<any> {
    return this.http.put(`${this.instanceUrl(counterpartyId)}/validate`, {});
  }

  updateReferences(counterpartyId: string, references: string[]): Observable<any> {
    return this.http.put(`${this.instanceUrl(counterpartyId)}/references`, { references });
  }

  getBanks(counterpartyId: string): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.instanceUrl(counterpartyId)}/banks`);
  }

  addBank(counterpartyId: string, bankRequest: BankRequest): Observable<CreatedBank> {
    return this.http.post<CreatedBank>(`${this.instanceUrl(counterpartyId)}/banks`, bankRequest);
  }

  updateBank(counterpartyId: string, bankId: string, bankRequest: BankRequest): Observable<any> {
    return this.http.put(`${this.instanceUrl(counterpartyId)}/banks/${bankId}`, bankRequest);
  }

  deleteBank(counterpartyId: string, bankId: string): Observable<any> {
    return this.http.delete(`${this.instanceUrl(counterpartyId)}/banks/${bankId}`);
  }
}
