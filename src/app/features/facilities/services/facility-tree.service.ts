import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITreeNode } from '../components/facility/facility.component';
import { ViewProjection } from '../components/view-facility/view-facility.component';

@Injectable({
  providedIn: 'root',
})
export class FacilityTreeService {
  constructor() {}

  generateTree(projection: ViewProjection): Observable<ITreeNode> {
    return of({
      name: projection?.facility.name,
      data: { exposure: projection?.exposure, facility: projection?.facility },
      level: 1,
      children: projection?.children.map((facility: any) => ({
        name: facility.facility.name,
        level: 2,
        data: { id: facility.id, exposure: facility.exposure, facility: facility.facility },
      })),
    });
  }
}
