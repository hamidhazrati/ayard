import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CounterpartyRoleService } from './counterparty-role.service';
import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';

describe('CounterpartyRoleService', () => {
  let service: CounterpartyRoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CounterpartyRoleService],
    });
    service = TestBed.inject(CounterpartyRoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('GIVEN the CounterpartyRoleService is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('WHEN we call the service', () => {
      test('THEN it should get all counterparty roles by default', fakeAsync(() => {
        service.getCounterpartyRoles().subscribe();

        tick();

        const req = httpMock.expectOne(`/counterpartyroles`);

        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN we call the service with a filter', () => {
      test('THEN it should get counterparties that are filtered', fakeAsync(() => {
        service.getCounterpartyRoles('abcd').subscribe();
        tick();
        const req = httpMock.expectOne(`/counterpartyroles?name=abcd`);
        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN we save a counterparty through the service', () => {
      test('THEN the role should be saved', fakeAsync(() => {
        const counterpartyRole: CounterpartyRole = {
          id: null,
          name: 'the name',
          description: 'a desc',
          required: true,
        };

        service.saveCounterpartyRole(counterpartyRole).subscribe();

        tick();

        const req = httpMock.expectOne(`/counterpartyroles`);

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(counterpartyRole);
      }));
    });

    describe('WHEN we check for uniqueness', () => {
      test.each`
        input          | response                     | expected
        ${'unique'}    | ${[]}                        | ${true}
        ${'encode me'} | ${[]}                        | ${true}
        ${'unique'}    | ${['other']}                 | ${true}
        ${'unique'}    | ${['unique']}                | ${false}
        ${'Unique'}    | ${['uNiQue']}                | ${false}
        ${'unique'}    | ${['part-unique']}           | ${true}
        ${'unique'}    | ${['part-unique', 'unique']} | ${false}
      `(
        'THEN returns $expected for "$input" and $response',
        fakeAsync(({ input, response, expected }) => {
          let isUnique: undefined | boolean;

          service.isUnique(input).subscribe((isUnique2) => {
            isUnique = isUnique2;
          });

          const req = httpMock.expectOne(`/counterpartyroles?name=${encodeURIComponent(input)}`);
          expect(req.request.method).toEqual('GET');

          req.flush(response.map((name) => ({ name })));

          expect(isUnique).toEqual(expected);
        }),
      );
    });
  });
});
