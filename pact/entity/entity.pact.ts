import { xpactWith } from 'jest-pact';
import { EntityService } from '@app/features/entities/services/entity.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { get, getWithParams, post, postNoBody } from '../helpers/request-helper';
import { created, ok } from '../helpers/response-helper';
import { getEntitiesBody, getEntitiesMatcher, getEntityMatcher } from './responses/get-entities';
import { postEntityCreated, postEntityMatcher } from './responses/post-entity';
import { postEntityBody } from './requests/post-entity';
import { entitySearch } from './requests/get-entity';

xpactWith({ consumer: 'operations-portal', provider: 'entity', cors: true }, (provider) => {
  describe('Entity API', () => {
    let service: EntityService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [EntityService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(EntityService);
    });

    describe('GET entity by id', () => {
      const getRequest = {
        uponReceiving: 'a request for entity by id',
        withRequest: get('/entity/d30de6c5-03b0-4eff-8430-23100e42869d'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have an entity with id d30de6c5-03b0-4eff-8430-23100e42869d',
          ...getRequest,
          willRespondWith: ok(getEntityMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getEntityById('d30de6c5-03b0-4eff-8430-23100e42869d')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntitiesBody[0]);
          });
      });
    });

    describe('GET entities', () => {
      const getRequest = {
        uponReceiving: 'a request for entities',
        withRequest: get('/entity'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of entities',
          ...getRequest,
          willRespondWith: ok(getEntitiesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getEntities()
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntitiesBody);
          });
      });
    });

    describe('GET entities by name', () => {
      const getRequest = {
        uponReceiving: 'a request for entities by name',
        withRequest: getWithParams('/entity', { name: '[*]' + 'myEntity' }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of entities',
          ...getRequest,
          willRespondWith: ok(getEntitiesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .getEntities('myEntity')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntitiesBody);
          });
      });
    });

    describe('POST entity', () => {
      const postRequest = {
        uponReceiving: 'a request to create an entity',
        withRequest: post('/entity', {
          ...postEntityBody,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created an entity',
          ...postRequest,
          willRespondWith: created(postEntityMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .saveEntity(postEntityBody)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(postEntityCreated);
          });
      });
    });

    describe('GET entities by matchcandidates search', () => {
      const getRequest = {
        uponReceiving: 'a request for entities by search criteria',
        withRequest: getWithParams('/entity/matchcandidates', {
          ...entitySearch,
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of entities',
          ...getRequest,
          willRespondWith: ok(getEntitiesMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .search(entitySearch)
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntitiesBody);
          });
      });
    });

    describe('POST entity by duns', () => {
      const postRequest = {
        uponReceiving: 'a request to create an entity by duns number',
        withRequest: postNoBody('/entity/153561212'),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have created an entity',
          ...postRequest,
          willRespondWith: ok(getEntityMatcher),
        });
      });

      it('returns a successful body', () => {
        return service
          .createFromDuns('153561212')
          .toPromise()
          .then((r) => {
            expect(r).toEqual(getEntitiesBody[0]);
          });
      });
    });
  });
});
