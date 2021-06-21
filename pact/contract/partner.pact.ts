'use strict';

import { pactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { created, ok, withPage } from '../helpers/response-helper';
import { getWithHttpParams, pageRequest, post } from '../helpers/request-helper';
import { getPartnerBody, getPartnerMatcher } from './responses/get-partners';
import { PartnerService } from '@app/features/partners/services/partner.service';
import { partnerBody } from './requests/post-partner';
import { postPartnerCreated, postPartnerMatcher } from './responses/post-partner';
import { withPageMatcher } from '../helpers/matcher-helper';

pactWith({ consumer: 'operations-portal', provider: 'contract', cors: true }, (provider) => {
  describe('Partner API', () => {
    let service: PartnerService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [PartnerService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(PartnerService);
    });

    describe('POST partner', () => {
      const postRequest = {
        uponReceiving: 'a request to create a partner',
        withRequest: post('/partner', {
          ...partnerBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'there is no test-partner',
          ...postRequest,
          willRespondWith: created(postPartnerMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .createPartner(partnerBody)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postPartnerCreated);
          });
      });
    });

    describe('GET Partner list', () => {
      const getPartnersRequest = {
        uponReceiving: 'a request for partners',
        withRequest: getWithHttpParams(
          '/partner',
          pageRequest({ name_starts_with: 'test-partner' }),
        ),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'a partner exists with name test-partner',
          ...getPartnersRequest,
          willRespondWith: ok(withPageMatcher(getPartnerMatcher)),
        });
      });

      it('returns a successful body', () => {
        return service
          .getPartners(pageRequest(), 'test-partner')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(withPage(getPartnerBody));
          });
      });
    });
  });
});
