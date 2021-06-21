import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { get, putNoBody } from '../helpers/request-helper';
import { ok } from '../helpers/response-helper';
import {
  getEntityMatchResultBody,
  getEntityMatchResultBodyMatcher,
} from './responses/matchrequest-responses';
import { MatchRequestService } from '@entities/services/match-request.service';

xpactWith({ consumer: 'operations-portal', provider: 'entity', cors: true }, (provider) => {
  describe('Match request API', () => {
    let service: MatchRequestService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [MatchRequestService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(MatchRequestService);
    });

    describe('GET match candidates', () => {
      const getRequest = {
        uponReceiving: 'a request for entity by id b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
        withRequest: get('/match-request/b593aa97-0d5a-4ad9-b015-d3e9dee9e396'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have an match request entity with id ',
          ...getRequest,
          willRespondWith: ok(getEntityMatchResultBodyMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getMatchingCandidates('b593aa97-0d5a-4ad9-b015-d3e9dee9e396')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntityMatchResultBody);
          });
      });
    });

    describe('PUT resolve match candidates', () => {
      const putRequest = {
        uponReceiving: 'a request to match candidates',
        withRequest: putNoBody(
          '/match-request/b593aa97-0d5a-4ad9-b015-d3e9dee9e396/resolve/b593aa97-0d5a-4ad9-b015-d3e9dee9e396',
        ),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i can match requests by id',
          ...putRequest,
          willRespondWith: ok(getEntityMatchResultBodyMatcher),
        });
      });

      it('returns a 204', () => {
        return service
          .resolve('b593aa97-0d5a-4ad9-b015-d3e9dee9e396', 'b593aa97-0d5a-4ad9-b015-d3e9dee9e396')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntityMatchResultBody);
          });
      });
    });
  });
});
