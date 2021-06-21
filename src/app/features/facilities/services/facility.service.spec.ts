import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeepPartial } from 'utility-types';
import { FacilityService } from './facility.service';
import { Facility } from './../models/facility.model';
import { FacilityOperation } from '../models/facility-operate.model';

describe('FacilityService', () => {
  let service: FacilityService;
  let httpMock: HttpTestingController;

  const getFacility = (facility: DeepPartial<Facility>): Facility => {
    return {
      ...facility,
    } as Facility;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FacilityService],
    });
    service = TestBed.inject(FacilityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GIVEN the service', () => {
    test('THEN it should exist', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('GIVEN an operation request', () => {
    test('THEN a request is made', fakeAsync(() => {
      let response = null;

      const request: FacilityOperation = {
        type: 'add-counterparty-limits-operation',
      } as FacilityOperation;
      service.operateFacility(request).subscribe((res) => {
        response = res;
      });

      tick();

      const req = httpMock.expectOne('/facility/operate');

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(request);

      req.flush({});

      expect(response).toEqual({});
    }));
  });

  describe('GIVEN there are saved facilities', () => {
    const facilities: Facility[] = [
      getFacility({ id: '1', name: 'Katerra' }),
      getFacility({ id: '2', name: 'Name 2' }),
    ];

    describe('WHEN all of the facilities are retrieved', () => {
      test('THEN facilities should be returned', fakeAsync(() => {
        let response = null;

        service.getFacilities().subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/facility');

        expect(req.request.method).toEqual('GET');

        req.flush(facilities);

        expect(response).toEqual(facilities);
      }));
    });

    describe('WHEN a single facility is retrieved', () => {
      test('THEN the facility should be returned', fakeAsync(() => {
        const facility = facilities[0];
        let response = null;

        service.getFacility(facility.id).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne(`/facility/${facility.id}`);

        expect(req.request.method).toEqual('GET');

        req.flush(facility);

        expect(response).toEqual(facility);
      }));
    });
  });
});
