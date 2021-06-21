import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@app/services/config/config.service';
import { Contract, ContractStatus } from '../models/contract.model';
import {
  CreatedContract,
  CreateUpdateContract,
} from '@app/features/contracts/models/contract.model';
import { ContractCounterparty } from '../models/counterparty.model';
import { Rule } from '@app/features/products/models/rule.model';
import { Page } from '@app/shared/pagination';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  setStatus(id: string, status: ContractStatus) {
    return this.http.put<CreatedContract>(this.host + `/contract/${id}/status`, {
      status,
    });
  }

  saveContract(contract: CreateUpdateContract): Observable<CreatedContract> {
    return this.http.post<CreatedContract>(this.host + '/contract', contract);
  }

  updateContract(id: string, contract: CreateUpdateContract): Observable<CreatedContract> {
    return this.http.put<CreatedContract>(this.host + `/contract/${id}`, contract);
  }

  updateContractRuleException(contract: Contract, rule: Rule): Observable<any> {
    const body = {
      name: rule.name,
      resource: rule.resource,
      resolutionType: rule.resolutionType,
    };

    return this.http.put(this.host + `/contract/${contract.id}/rule`, body);
  }

  getContractById(id: string): Observable<Contract> {
    return this.http.get<Contract>(this.host + `/contract/${id}`);
  }

  getContractCounterpartiesById(id: string): Observable<ContractCounterparty[]> {
    return this.http.get<ContractCounterparty[]>(this.host + `/contract-counterparty/list/${id}`);
  }

  getContracts(params: HttpParams): Observable<Page<Contract>> {
    const url = this.host + '/contract/v2/list';
    return this.http.get<Page<Contract>>(url, { params });
  }

  getSellerCounterparties(): Observable<any> {
    return this.http.get(this.host + '/contract-counterparty/seller');
  }
  deleteCounterparty(cp: ContractCounterparty): Observable<any> {
    return this.http.delete(`${this.host}/contract-counterparty/${cp.id}`);
  }
}
