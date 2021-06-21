import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreatedEntity, CreateUpdateEntity, Entity } from '@entities/models/entity.model';
import { EntitySearch } from '@entities/models/entity-search.model';
import { EntitySearchResult } from '@entities/models/entity-search-result.model';
import { ConfigService } from '@app/services/config/config.service';

interface IEntitiesQuery {
  pagination: any;
  result: any;
}

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  readonly host: string = this.configService.getApiUrl();

  constructor(private http: HttpClient, private configService: ConfigService) {}

  approveEntity(entityId: string): Observable<any> {
    return this.http.put(`${this.host}/entity/${entityId}/approve`, {});
  }

  createFromDuns(dunsNumber: string): Observable<CreatedEntity> {
    return this.http.post<CreatedEntity>(this.host + `/entity/${dunsNumber}`, {});
  }

  getEntityById(id: string): Observable<Entity> {
    return this.http.get<Entity>(this.host + `/entity/${id}`);
  }

  getEntities(name?: string): Observable<any> {
    let parameters = {};

    if (name) {
      parameters = { ...parameters, name: `[*]${name}` };
    }

    return this.http.get<Entity[]>(this.host + '/entity', {
      params: parameters,
    });
  }

  queryEntities(name?: string, queryParameters?: object): Observable<IEntitiesQuery> {
    let params: any = {
      page: 0,
      size: 10,
      version: 2,
    };

    if (queryParameters) {
      params = { ...params, ...queryParameters };
    }

    if (name) {
      params = { ...params, name: `${name}` };
    }

    return this.http.get<IEntitiesQuery>(this.host + '/entity', { params });
  }

  rejectEntity(entityId: string): Observable<any> {
    return this.http.delete(`${this.host}/entity/${entityId}/reject`);
  }

  saveEntity(entity: CreateUpdateEntity): Observable<CreatedEntity> {
    return this.http.post<CreatedEntity>(this.host + '/entity', entity);
  }

  search(entitySearch: EntitySearch): Observable<EntitySearchResult[]> {
    let params: HttpParams = new HttpParams();
    for (const [key, value] of Object.entries(entitySearch)) {
      if (value) {
        params = params.set(key, value);
      }
    }
    return this.http.get<EntitySearchResult[]>(this.host + '/entity/matchcandidates', {
      params,
    });
  }
}
