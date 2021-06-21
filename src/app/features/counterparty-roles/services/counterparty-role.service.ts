import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  CounterpartyRole,
  CreatedCounterpartyRole,
  CreateUpdateCounterpartyRole,
} from '@app/features/counterparty-roles/models/counterparty.role';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CounterpartyRoleService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  saveCounterpartyRole(
    roleType: CreateUpdateCounterpartyRole,
  ): Observable<CreatedCounterpartyRole> {
    return this.http.post<CreatedCounterpartyRole>(this.host + '/counterpartyroles', roleType);
  }

  getCounterpartyRoles(name?: string): Observable<CounterpartyRole[]> {
    if (name) {
      return this.http.get<CounterpartyRole[]>(this.host + '/counterpartyroles', {
        params: { name },
      });
    } else {
      return this.http.get<CounterpartyRole[]>(this.host + '/counterpartyroles');
    }
  }

  isUnique(name: string) {
    return this.http
      .get<CounterpartyRole[]>(this.host + '/counterpartyroles', { params: { name } })
      .pipe(
        map((results) => {
          if (!results?.length) {
            return true;
          }

          return !results.find((counterpartyRole) => {
            if (name.length !== counterpartyRole?.name?.length) {
              return false;
            }

            return !name.localeCompare(counterpartyRole?.name, undefined, {
              sensitivity: 'base',
            });
          });
        }),
      );
  }
}
