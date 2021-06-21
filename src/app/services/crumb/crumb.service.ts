import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Breadcrumb } from '@app/shared/components/breadcrumbs/breadcrumb.model';
import { dashboardCrumb } from '@app/features/dashboard/dashboard.crumb';

@Injectable({
  providedIn: 'root',
})
export class CrumbService {
  private dataSource: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>(
    dashboardCrumb(),
  );
  public crumbs: Observable<Breadcrumb[]> = this.dataSource.asObservable();

  constructor() {}

  public setCrumbs(crumbs: Breadcrumb[]) {
    const rest = [...crumbs];
    const last = rest.pop();

    delete last.link;

    this.dataSource.next([...rest, last]);
  }

  public getCrumbs(): Observable<Breadcrumb[]> {
    return this.crumbs;
  }
}
