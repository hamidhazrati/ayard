import { MockService } from 'ng-mocks';
import { KeycloakService } from 'keycloak-angular';
import Mocked = jest.Mocked;
import { AuthService } from '@app/auth/auth-service';

const jwt =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6ImNhc2hmbG93OmFwcHJvdmUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0IiwianRpIjoiZWIyNjIyNWUtYTEwZC00ZGQxLWJhNTktNWQyN2M1ODQ2MjQ2IiwiaWF0IjoxNjAwNzk0MDQ5LCJleHAiOjE2MDA3OTc2NDl9.nfEP34TU3iex_x8y0pOBsWK8yDTDuRYUlZE49zqHSYg';
describe('AuthUtils', () => {
  let authService: AuthService;
  const mockKeyCloakService: Mocked<KeycloakService> = MockService(KeycloakService) as Mocked<
    KeycloakService
  >;

  beforeEach(() => {
    authService = new AuthService(mockKeyCloakService);
    mockKeyCloakService.getToken.mockReturnValue(
      new Promise((resolve, reject) => {
        return resolve(jwt);
      }),
    );
  });

  test('should contain `cashflow:approve` scope', () => {
    return authService.isAuthorised('cashflow:approve').then((data) => {
      expect(data).toEqual(true);
    });
  });

  test('should get username', () => {
    return authService.getUserName().then((data) => {
      expect(data).toEqual('test');
    });
  });
});
