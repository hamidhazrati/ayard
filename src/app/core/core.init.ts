import { KeycloakService } from 'keycloak-angular';
import { ConfigService } from '../services/config/config.service';

export const initializer = (
  configService: ConfigService,
  keycloak: KeycloakService,
): (() => Promise<any>) => {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await configService.loadConfigurations().toPromise();
        await keycloak.init({
          config: configService.getKeycloakConfig(),
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false,
          },
          bearerExcludedUrls: [],
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
};
