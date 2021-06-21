import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { map } from 'rxjs/operators';
import {
  convert,
  ViewProjection,
} from '@app/features/facilities/components/view-facility/view-facility.component';

@Injectable()
export class ExposureResolveService implements Resolve<ViewProjection> {
  constructor(private readonly exposureService: ExposureService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ViewProjection> {
    return this.exposureService
      .getFacility(route.paramMap.get('id'))
      .pipe(map((projection) => convert(projection)));
  }
}
