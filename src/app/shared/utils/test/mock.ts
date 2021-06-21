import Mocked = jest.Mocked;
import { MockService as NgMocksMockService } from 'ng-mocks';

export function MockService<T>(service: new (...args: any[]) => T): Mocked<T> {
  return NgMocksMockService<T>(service) as Mocked<T>;
}
