import { TestBed } from '@angular/core/testing';

import { CurrencyService } from './currency.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@app/services/config/config.service';
import { MockService } from '@app/shared/utils/test/mock';
import Mocked = jest.Mocked;

describe('CurrencyService', () => {
  const API_URL = 'http://localhost';
  let service: CurrencyService;
  let httpMock: HttpTestingController;
  let configService: Mocked<ConfigService>;

  const stubCurrencies = [
    {
      code: 'USD',
      decimals: 3,
      dayCountConvention: 'actual/365',
    },
    {
      code: 'JPY',
      decimals: 3,
      dayCountConvention: 'actual/365',
    },
    {
      code: 'EUR',
      decimals: 3,
      dayCountConvention: 'actual/365',
    },
    {
      code: 'GBP',
      decimals: 3,
      dayCountConvention: 'actual/365',
    },
  ];

  beforeEach(() => {
    configService = MockService(ConfigService);
    configService.getApiUrl.mockReturnValue(API_URL);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService, { provide: ConfigService, useValue: configService }],
    });

    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('GIVEN the service is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('WHEN we get currencies', () => {
      test('THEN it should return currencies', (done) => {
        service.getCurrencies().subscribe((response) => {
          expect(response).toEqual(stubCurrencies);

          // ensure that the response is sorted alphabetically
          expect(response[0].code).toEqual('EUR');
          expect(response[1].code).toEqual('GBP');
          expect(response[2].code).toEqual('JPY');
          expect(response[3].code).toEqual('USD');

          done();
        });

        const req = httpMock.expectOne(`${API_URL}/currencies`);
        expect(req.request.method).toBe('GET');
        req.flush(stubCurrencies);
      });
    });
  });
});
