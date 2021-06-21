import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PartnerCreated, PartnerService } from '@app/features/partners/services/partner.service';
import { Partner } from '@app/features/partners/model/partner.model';
import { Page, PageRequestFactory } from '@app/shared/pagination';
import { HttpParams } from '@angular/common/http';
import { SortDirection } from '@greensill/gds-ui/data-table';

describe('PartnerService', () => {
  let service: PartnerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PartnerService],
    });
    service = TestBed.inject(PartnerService);
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

  describe('GIVEN a partner', () => {
    const partner: Partner = {
      id: 'id',
      name: 'Partner A',
      entityId: 'entity_id',
    };
    const partnerIdOfCreatedPartner: PartnerCreated = { id: '123' };

    describe('WHEN the partner is saved', () => {
      test('THEN the correct call is made to the external partner service', fakeAsync(() => {
        let response = null;

        service.createPartner(partner).subscribe((res) => {
          response = res;
        });

        tick();

        const req = httpMock.expectOne('/partner');

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(partner);

        req.flush(partnerIdOfCreatedPartner);

        expect(response).toEqual(partnerIdOfCreatedPartner);
      }));
    });
  });

  describe('GIVEN a name query string', () => {
    describe('WHEN calling the service to get partners with name starting as the name query', () => {
      test('THEN the correct call is made', fakeAsync(() => {
        const params: HttpParams = new PageRequestFactory().createHttpParams({
          page: 0,
          pageSize: 10,
        });
        const nameStartsWith = 'abc';
        service.getPartners(params, nameStartsWith).subscribe();
        tick();
        const req = httpMock.expectOne('/partner?name_starts_with=abc&page=0&size=10');
        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN calling the service to get partners with name starting as undefined', () => {
      test('THEN the correct call is made with empty string', fakeAsync(() => {
        const nameStartsWith = undefined;
        service.getAllPartners(nameStartsWith).subscribe();
        tick();
        const req = httpMock.expectOne('/partner?name_starts_with=&page=0&size=2147483647');
        expect(req.request.method).toEqual('GET');
      }));
    });
  });

  describe('GIVEN pagination metadata', () => {
    describe('WHEN calling the service to get partners with page size and page number', () => {
      test('THEN the correct call is made', fakeAsync(() => {
        const params: HttpParams = new PageRequestFactory().createHttpParams({
          page: 0,
          pageSize: 10,
        });
        const nameStartsWith = 'abc';
        service.getPartners(params, nameStartsWith).subscribe();
        tick();
        const req = httpMock.expectOne('/partner?name_starts_with=abc&page=0&size=10');
        expect(req.request.method).toEqual('GET');
      }));
    });

    describe('WHEN calling the service to get partners with sorting', () => {
      test('THEN the correct call is made with empty string', fakeAsync(() => {
        const params: HttpParams = new PageRequestFactory().createHttpParams(
          {
            page: 0,
            pageSize: this.MAX_PAGE_SIZE,
          },
          { prop: 'name', dir: SortDirection.asc },
        );
        service.getPartners(params).subscribe();
        tick();
        const req = httpMock.expectOne('/partner?name_starts_with=&page=0&size=10&sort=name,asc');
        expect(req.request.method).toEqual('GET');
      }));
    });
  });

  describe('WHEN a check is made to see if the partner name candidate is unique', () => {
    test('THEN no call is made to partner service if name is null', fakeAsync(() => {
      let response = null;
      service.isPartnerNameUnique(null).subscribe((res) => {
        response = res;
      });
      expect(response).toBeTruthy();
    }));

    test('it should be able to acertain if it is unique - not unique', fakeAsync(() => {
      let isUnique = null;
      const nameCandidate = 'abc';
      const partnerResponse: Partner[] = [
        {
          id: 'id',
          name: 'abc',
          entityId: 'entityId',
        },
      ];
      const pagedPartner: Page<Partner> = {
        data: partnerResponse,
        meta: {
          paged: {
            size: 1,
            page: 0,
            totalPages: 1,
            pageSize: 10,
            totalSize: 1,
          },
        },
      };
      service.isPartnerNameUnique(nameCandidate).subscribe((res) => {
        isUnique = res;
      });

      const req = httpMock.expectOne(
        '/partner?name_starts_with=' + nameCandidate + '&page=0&size=2147483647',
      );
      expect(req.request.method).toEqual('GET');

      req.flush(pagedPartner);
      expect(isUnique).toEqual(false);
    }));

    test('it should be able to acertain if it is unique - unique', fakeAsync(() => {
      let isUnique = null;
      const partnerResponse: Partner[] = [];

      const pagedPartner: Page<Partner> = {
        data: partnerResponse,
        meta: {
          paged: {
            size: 1,
            page: 0,
            totalPages: 1,
            pageSize: 10,
            totalSize: 1,
          },
        },
      };
      service.isPartnerNameUnique('abc').subscribe((res) => {
        isUnique = res;
      });

      const req = httpMock.expectOne(
        '/partner?name_starts_with=' + 'abc' + '&page=0&size=2147483647',
      );
      expect(req.request.method).toEqual('GET');

      req.flush(pagedPartner);
      expect(isUnique).toEqual(true);
    }));
  });
});
