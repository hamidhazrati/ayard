'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { get, post } from '../helpers/request-helper';
import { ok } from '../helpers/response-helper';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import { getFacilityBody, getFacilityMatcher } from './response/get-facility';
import { postFacilityOperation } from './request/post-facility';
import { getFacilitySearchQueryBody } from './request/get-facility';
import {
  postFacilityBodyMatcher,
  postFacilitySearchResult,
  postFacilitySearchResultMatcher,
} from './response/post-facility';

xpactWith({ consumer: 'operations-portal', provider: 'exposure', cors: true }, (provider) => {
  describe('Facility API', () => {
    let service: FacilityService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [FacilityService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(FacilityService);
    });

    describe('GET Facilites', () => {
      const getFacilitiesRequest = {
        uponReceiving: 'a request for facilities',
        withRequest: get('/facility'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of facilities',
          ...getFacilitiesRequest,
          willRespondWith: ok(getFacilityMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getFacilities()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getFacilityBody);
          });
      });
    });

    describe('POST facility search', () => {
      const postRequest = {
        uponReceiving: 'a request to search for a facility',
        withRequest: post('/facility/search', {
          ...getFacilitySearchQueryBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i can search for a facility',
          ...postRequest,
          willRespondWith: ok(postFacilitySearchResultMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .search(getFacilitySearchQueryBody)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postFacilitySearchResult);
          });
      });
    });

    describe('GET Facility by Id', () => {
      const getRequest = {
        uponReceiving: 'a request for facility by Id',
        withRequest: get('/facility/b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a facility with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
          ...getRequest,
          willRespondWith: ok(getFacilityMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getFacility('b593aa97-0d5a-4ad9-b015-d3e9dee9e396')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getFacilityBody);
          });
      });
    });

    describe('POST Facility', () => {
      const postRequest = {
        uponReceiving: 'a request to execute a facility',
        withRequest: post('/facility/operate', {
          ...postFacilityOperation,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i execute a facility with id b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
          ...postRequest,
          willRespondWith: ok(postFacilityBodyMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .operateFacility(postFacilityOperation)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getFacilityBody);
          });
      });
    });
  });
});
