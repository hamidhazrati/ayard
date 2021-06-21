import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay, take } from 'rxjs/operators';
import { ConfigResponse } from '@app/services/config/config-response.model';
import { KeycloakConfig } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config$: Observable<ConfigResponse>;
  private config: ConfigResponse;

  constructor(private readonly http: HttpClient) {}

  public getApiUrl(): string {
    return this.config?.API_URL || '';
  }

  public getKeycloakConfig(): KeycloakConfig {
    return {
      url: this.config?.AUTH_URL,
      realm: this.config?.AUTH_REALM,
      clientId: this.config?.AUTH_CLIENT_ID,
    };
  }

  public loadConfigurations() {
    if (!this.config$) {
      this.config$ = this.http.get<ConfigResponse>(`/config`).pipe(shareReplay(1));
      this.config$.pipe(take(1)).subscribe((config) => (this.config = config));
    }

    return this.config$;
  }
}
