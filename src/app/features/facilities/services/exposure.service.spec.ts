import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { buildTestFacilityProjection } from '@app/features/facilities/facilities.test-utils';

describe('ExposureService', () => {
  let service: ExposureService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExposureService],
    });
    service = TestBed.inject(ExposureService);
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

  describe('GIVEN there are saved facilities', () => {
    const facilityProjections: FacilityProjection[] = [
      buildTestFacilityProjection({
        facility: { id: '1', name: 'Katerra', children: [] },
        children: [],
      }),
      buildTestFacilityProjection({
        facility: { id: '2', name: 'Name 2', children: [] },
        children: [],
      }),
    ];

    describe('WHEN all of the facilityProjections are retrieved', () => {
      test('THEN facilityProjections should be returned', fakeAsync(() => {
        let response = null;

        service.getFacilities().subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/exposure/facility');

        expect(req.request.method).toEqual('GET');

        req.flush(facilityProjections);

        expect(response).toEqual(facilityProjections);
      }));
    });

    describe('WHEN a single facility projection is retrieved', () => {
      test('THEN the facility projection should be returned', fakeAsync(() => {
        const facilityProjection = facilityProjections[0];
        let response = null;

        service.getFacility(facilityProjection.facility.id).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne(`/exposure/facility/${facilityProjection.facility.id}`);

        expect(req.request.method).toEqual('GET');

        req.flush(facilityProjection);

        expect(response).toEqual(facilityProjection);
      }));
    });
  });
});
