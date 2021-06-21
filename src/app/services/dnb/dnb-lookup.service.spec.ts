import { TestBed, getTestBed } from '@angular/core/testing';
import { DnbLookupService } from './dnb-lookup.service';
import { DnbLookup } from './dnb-lookup.model';
import { ConfigService } from '../config/config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntityService } from '@app/features/entities/services/entity.service';

describe('DnbLookupService', () => {
  const API_URL = 'http://localhost:8080';
  class MockConfigService extends ConfigService {
    public getApiUrl(): string {
      return API_URL;
    }
  }

  let injector: TestBed;
  let service: DnbLookupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const mockConfigService: ConfigService = new MockConfigService(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntityService, { provide: ConfigService, useValue: mockConfigService }],
    });
    injector = getTestBed();
    service = TestBed.inject(DnbLookupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(DnbLookupService);
    expect(service).toBeTruthy();
  });

  describe('WHEN we call the service with a known duns', () => {
    test('THEN it should return a valid response', () => {
      const dummyResponse = {
        legalEntityName: 'test name',
        address: {
          line1: 'test line 1',
          line2: 'test line 2',
          city: 'test city',
          country: 'test country',
          postalCode: 'AA1 1BB',
        },
      } as DnbLookup;

      service.getByDunsNumber('123456789').subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/dnb/duns-summary/123456789`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyResponse);
    });
  });
});
