import { TestBed } from '@angular/core/testing';

import { EntityService } from './entity.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { Entity } from '@entities/models/entity.model';
import { EntitySearch } from '@entities/models/entity-search.model';

const API_URL = 'http://localhost:8080';

describe('EntityService', () => {
  let service: EntityService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EntityService,
        {
          provide: ConfigService,
          useValue: {
            getApiUrl(): string {
              return API_URL;
            },
          },
        },
      ],
    });
    service = TestBed.inject(EntityService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should load the service', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the entity with the right ID parameter', () => {
    jest.spyOn(httpClient, 'get');
    const id = '1';
    service.getEntityById(id);
    expect(httpClient.get).toBeCalledWith(`${service.host}/entity/${id}`);
  });

  it('should retrieve the entity with the default parameter', () => {
    jest.spyOn(httpClient, 'get');
    const params = {};
    service.getEntities();
    expect(httpClient.get).toBeCalledWith(`${service.host}/entity`, { params });
  });

  it('should retrieve the entity with the default parameter from version 2 of entity service.', () => {
    jest.spyOn(httpClient, 'get');
    const entityName = 'Tesco';
    const params = { size: 20, version: 2 };
    service.queryEntities('Tesco', params);
    expect(httpClient.get).toHaveBeenCalledWith(`${service.host}/entity`, {
      params: { ...params, name: `${entityName}`, page: 0 },
    });
  });

  it('should retrieve the entity with necessary parameters.', () => {
    jest.spyOn(httpClient, 'get');
    const name = 'Tesla';
    service.getEntities(name);
    const params = { name: `[*]${name}` };
    expect(httpClient.get).toBeCalledWith(`${service.host}/entity`, { params });
  });

  it('should save the entity', () => {
    jest.spyOn(httpClient, 'post');
    const entity: Entity = {
      id: null,
      name: 'the name',
      dunsNumber: null,
      address: null,
    };
    service.saveEntity(entity);
    expect(httpClient.post).toBeCalledWith(`${service.host}/entity`, entity);
  });

  it('should be able to create entity from DUNS', () => {
    jest.spyOn(httpClient, 'post');
    const dunsNumber = '754743564';
    service.createFromDuns(dunsNumber);
    expect(httpClient.post).toBeCalledWith(`${service.host}/entity/${dunsNumber}`, {});
  });

  it('should search for entities.', () => {
    jest.spyOn(httpClient, 'get');
    const search: EntitySearch = {
      name: 'name',
      dunsNumber: '7365263',
      country: 'United Kingdom',
      address: 'London Road',
      postalCode: 'WC1A 2FP',
      region: 'Nottinghamshire',
    };
    service.search(search);
    expect(httpClient.get).toHaveBeenCalled();
  });
});
