import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MatchRequestService } from './match-request.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';

const API_URL = 'http://localhost:8080';
class MockConfigService extends ConfigService {
  constructor(http: HttpClient) {
    super(http);
  }

  public getApiUrl(): string {
    return API_URL;
  }
}

describe('MatchRequestService', () => {
  let service: MatchRequestService;
  let httpMock: HttpTestingController;
  const mockConfigService: ConfigService = new MockConfigService(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatchRequestService, { provide: ConfigService, useValue: mockConfigService }],
    });
    service = TestBed.inject(MatchRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('GIVEN the MatchRequestService is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('WHEN we call the service', () => {
      test('THEN it should resolve the matchRequestId', fakeAsync(() => {
        service.resolve('abcd', '1234').subscribe();
        tick();
        const req = httpMock.expectOne(`${API_URL}/match-request/abcd/resolve/1234`);
        expect(req.request.method).toEqual('PUT');
      }));
    });

    describe('WHEN we call the service to get matchCandidates', () => {
      test('THEN it should get all matching candidates', fakeAsync(() => {
        service.getMatchingCandidates('abcd').subscribe();
        tick();
        const req = httpMock.expectOne(`${API_URL}/match-request/abcd`);
        expect(req.request.method).toEqual('GET');
      }));
    });
  });
});
