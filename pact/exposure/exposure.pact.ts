'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { get } from '../helpers/request-helper';
import { ok } from '../helpers/response-helper';
import { getExposureFacilityBody, getExposureFacilityBodyMatcher } from './response/get-facility';
import { ExposureService } from '@app/features/facilities/services/exposure.service';

xpactWith({ consumer: 'operations-portal', provider: 'exposure', cors: true }, (provider) => {
  describe('Exposure API', () => {
    let service: ExposureService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [ExposureService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(ExposureService);
    });

    describe('GET Exposure facilities', () => {
      const getExposureFacilitiesRequest = {
        uponReceiving: 'a request for exposure facilities',
        withRequest: get('/exposure/facility'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of exposure facilities',
          ...getExposureFacilitiesRequest,
          willRespondWith: ok(getExposureFacilityBodyMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getFacilities()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getExposureFacilityBody);
          });
      });
    });

    describe('GET Exposure facilities by id', () => {
      const getExposureFacilitiesRequest = {
        uponReceiving: 'a request for exposure facilities by id',
        withRequest: get('/exposure/facility/abc-123'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of exposure facilities by id',
          ...getExposureFacilitiesRequest,
          willRespondWith: ok(getExposureFacilityBodyMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getFacility('abc-123')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getExposureFacilityBody);
          });
      });
    });
  });
});
