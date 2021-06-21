import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { Observable } from 'rxjs';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExposureService {
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  private readonly host: string;

  private static rebuildFacilities = (data: FacilityProjection) => {
    data.facility.children = data.children.map((c) => {
      ExposureService.rebuildFacilities(c);
      return c.facility;
    });

    return data;
  };

  getFacilities(): Observable<FacilityProjection[]> {
    return this.http
      .get<FacilityProjection[]>(this.host + '/exposure/facility')
      .pipe(map((res) => res.map(ExposureService.rebuildFacilities)));
  }

  getFacility(id: string): Observable<FacilityProjection> {
    return this.http
      .get<FacilityProjection>(this.host + `/exposure/facility/${id}`)
      .pipe(map(ExposureService.rebuildFacilities));
  }
}
