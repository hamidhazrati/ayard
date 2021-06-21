import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { listFacilitiesCrumb } from '@app/features/facilities/components/list-facilities/list-facilities.crumb';
import { first, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import { isTotalLimit, TotalLimit } from '@app/features/facilities/models/limit.model';
import {
  Classifiable,
  LimitResult,
} from '@app/features/facilities/models/facility-projection.model';
import { isNegative } from '@app/shared/utils/number-util';

@Component({
  selector: 'app-list-facilities',
  templateUrl: './list-facilities.component.html',
})
export class ListFacilitiesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'currency', 'exposure', 'creditLimit', 'creditAvailable'];
  facilities = of<FacilityRow[]>([]);
  loading = false;

  constructor(
    private exposureService: ExposureService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.crumbService.setCrumbs(listFacilitiesCrumb());
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.facilities = this.exposureService.getFacilities().pipe(
      first(),
      tap(() => (this.loading = false)),
      map((facilities) => {
        return facilities.map<FacilityRow>(({ facility, exposure }) => {
          const { id, name, currency } = facility;
          const creditLimitResult = ((exposure.results?.[0]?.results || []) as LimitResult<
            Classifiable
          >[])
            .filter(({ limit }) => isTotalLimit(limit))
            .find((r) => {
              const limit = r.limit as TotalLimit;
              return limit.limitType === 'CREDIT';
            });

          return {
            id,
            name,
            currency,
            creditLimit: creditLimitResult?.total,
            creditAvailable: creditLimitResult?.available,
            exposure: exposure.results?.[0]?.results?.[0].used,
          };
        });
      }),
    );
  }

  isNegative(num: number): boolean {
    return isNegative(num);
  }
}

export interface FacilityRow {
  id: string;
  name: string;
  currency: string;
  exposure: number;
  creditLimit: number;
  creditAvailable: number;
}
