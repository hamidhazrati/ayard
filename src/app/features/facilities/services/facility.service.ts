import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { Observable, of } from 'rxjs';
import { Facility } from '@app/features/facilities/models/facility.model';
import { FacilitySearchQuery } from '@app/features/facilities/models/facility-search-query.model';
import { FacilitySearchResult } from '@app/features/facilities/models/facility-search-result.model';
import { FacilityOperation } from './../models/facility-operate.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.host}/facility`);
  }

  getFacility(id: string): Observable<Facility> {
    return this.http.get<Facility>(`${this.host}/facility/${id}`);
  }

  search(query: FacilitySearchQuery): Observable<FacilitySearchResult[]> {
    return this.http.post<FacilitySearchResult[]>(`${this.host}/facility/search`, query);
  }

  operateFacility(operation: FacilityOperation): Observable<object> {
    return this.http.post(`${this.host}/facility/operate`, operation);
  }

  isUnique(value: string): Observable<boolean> {
    return this.search({ type: 'by-name-facility-search-query', name: value }).pipe(
      map((searchResults) => !searchResults || searchResults.length === 0),
    );
  }
}
