import { KeycloakService } from 'keycloak-angular';
import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public invalidPermissionMsg = "you don't have permission";

  constructor(private keycloakService: KeycloakService) {}

  getUserName(): Promise<string> {
    return this.getDecodedToken().then((token) => token.preferred_username);
  }

  isAuthorised(scope: string): Promise<boolean> {
    return this.getScopes().then((scopes: string[]) => scopes.includes(scope));
  }

  private getDecodedToken() {
    return this.keycloakService
      .getToken()
      .then((token) => {
        return jwt_decode(token);
      })
      .catch((error) => {
        console.error('Failed to fetch token from Keycloak Service');
        throw new Error(error);
      });
  }

  private getScopes(): Promise<string[]> {
    return this.getDecodedToken().then((token) => token.scope.split(' '));
  }
}
