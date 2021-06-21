import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  describe('GIVEN the bodyGridStatus is set to true', () => {
    test('THEN it will emit status true', (done) => {
      service.showBodyGrid(true);

      service.bodyGridStatus$.subscribe((status) => {
        expect(status).toBe(true);
        done();
      });
    });
  });

  describe('GIVEN the bodyGridStatus is set to false', () => {
    test('THEN it will emit status false', (done) => {
      service.showBodyGrid(false);

      service.bodyGridStatus$.subscribe((status) => {
        expect(status).toBe(false);
        done();
      });
    });
  });
});
