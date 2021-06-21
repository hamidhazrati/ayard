import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { viewFacilityCrumb } from '@app/features/facilities/components/view-facility/view-facility.crumb';
import { ExposureService } from '@app/features/facilities/services/exposure.service';
import {
  Classifiable,
  EntityExposureSet,
  Exposure,
  ExposureSet,
  FacilityProjection,
  HomogenousExposureSet,
  HomogenousObject,
  LimitResult,
} from '@app/features/facilities/models/facility-projection.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import {
  ConfigurableFacility,
  ContractTotalFacility,
  Facility,
  isConcentrationFacility,
  isConfigurableFacility,
  isPerCounterpartyTotalFacility,
  isProductTotalFacility,
  PerCounterpartyTotalFacility,
  ProductTotalFacility,
  RelationshipFacility,
} from '@app/features/facilities/models/facility.model';
import { Entity } from '@entities/models/entity.model';
import { isGuarantorLimit, isTotalLimit } from '@app/features/facilities/models/limit.model';
import { isNegative } from '@app/shared/utils/number-util';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  AddContractFacilityDialogComponent,
  AddContractFacilityDialogComponentDialogData,
} from '@app/features/facilities/components/view-facility/add-contract-facility-dialog/add-contract-facility-dialog.component';
import {
  AddChildFacilityOperation,
  FacilityOperation,
} from '@app/features/facilities/models/facility-operate.model';
import { FacilityService } from '@app/features/facilities/services/facility.service';
import {
  AddProductFacilityComponentDialogComponent,
  AddProductFacilityComponentDialogData,
} from '@app/features/facilities/components/view-facility/add-product-facility-component-dialog/add-product-facility-component-dialog.component';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-view-facility',
  templateUrl: './view-facility.component.html',
})
export class ViewFacilityComponent implements OnInit {
  projection: ViewProjection;
  facilityProjection: FacilityProjection;
  data$: Observable<ViewProjection>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private exposureService: ExposureService,
    private facilityService: FacilityService,
    private crumbService: CrumbService,
    private dialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.data$ = this.route.params.pipe(switchMap(({ id }) => this.getFacility(id)));
  }

  getFacility(id): Observable<ViewProjection> {
    return this.exposureService.getFacility(id).pipe(
      tap((data) => this.crumbService.setCrumbs(viewFacilityCrumb(data))),
      tap((data: FacilityProjection) => (this.facilityProjection = data)),
      map((data: FacilityProjection) => convert(data)),
    );
  }

  isNegative(num: number): boolean {
    return isNegative(num);
  }

  addContractFacility() {
    this.openEditFacilityDialog<AddContractFacilityDialogComponentDialogData>(
      AddContractFacilityDialogComponent,
      {
        parents: this.getParentalFacilities(this.facilityProjection),
      },
    );
  }

  private getParentalFacilities(facility: FacilityProjection) {
    const facilities: Facility[] = [];

    const extractFacilities = (p: FacilityProjection) => {
      if (p.facility.type === 'relationship-facility') {
        facilities.push(p.facility as Facility);
      }

      p.children.forEach((c) => extractFacilities(c));
    };

    extractFacilities(facility);

    return facilities;
  }

  editContractFacility(facility: Facility2<ContractTotalFacility>) {
    this.openEditFacilityDialog<AddContractFacilityDialogComponentDialogData>(
      AddContractFacilityDialogComponent,
      {
        parents: this.getParentalFacilities(this.facilityProjection),
        existing: facility as ContractTotalFacility,
      },
    );
  }

  addProductFacilityComponent(parent: { id: string; currency: string }) {
    this.dialogService
      .open<
        AddProductFacilityComponentDialogComponent,
        AddProductFacilityComponentDialogData,
        AddChildFacilityOperation
      >(AddProductFacilityComponentDialogComponent, {
        data: {
          parent,
        },
        minWidth: '30vw',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((operation) => {
        if (!operation) {
          return;
        }

        this.data$ = this.facilityService
          .operateFacility(operation)
          .pipe(switchMap(({ id }: Facility) => this.getFacility(id)));
      });
  }

  openEditFacilityDialog<D>(
    componentOrTemplateRef: ComponentType<any> | TemplateRef<any>,
    data: D,
  ) {
    this.dialogService.closeAll();

    this.dialogService
      .open<typeof componentOrTemplateRef, D, FacilityOperation>(componentOrTemplateRef, {
        ...(data && { data }),
        minWidth: '30vw',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((operation) => {
        if (!operation) {
          return;
        }

        this.data$ = this.facilityService
          .operateFacility(operation)
          .pipe(switchMap(({ id }: Facility) => this.getFacility(id)));
      });
  }
}

function mapFacility(facilityProjection: FacilityProjection) {
  return {
    ...facilityProjection,
    exposure: mapExposureSet(facilityProjection.exposure),
  };
}

function convertContractFacility(
  projection: FacilityProjection,
  relationshipProjection: FacilityProjection,
): ViewProjection['children'][number] {
  return {
    ...projection,
    exposure: mapExposureSet(projection.exposure),
    facility: {
      ...(projection.facility as ContractTotalFacility),
      // @ts-ignore
      dcl: findDcl(
        // @ts-ignore
        projection.children
          .filter(({ facility }) => isPerCounterpartyTotalFacility(facility))
          .map((f) => f.facility),
      ),
    },
    sections: {
      // @ts-ignore
      products: projection.children
        .filter(({ facility }) => isProductTotalFacility(facility))
        .map((f) => mapFacility(f)),
      // @ts-ignore
      perCounterparties: projection.children
        .filter(({ facility }) => isPerCounterpartyTotalFacility(facility))
        .map((f) => mapFacility(f)),
      // @ts-ignore
      other: projection.children.find(
        ({ facility }) => isConfigurableFacility(facility) || isConcentrationFacility(facility),
      ),
      guarantors: mapToGuarantorResults(relationshipProjection).concat(
        ...flattenFacilityProjection(projection).map((p) => mapToGuarantorResults(p)),
      ),
    },
  };
}

function mapToGuarantorResults(facilityProjection: FacilityProjection): GuarantorResult[] {
  return [].concat(
    // @ts-ignore
    ...facilityProjection.exposure.results.map((r) => {
      return r.results
        .filter((result) => isGuarantorLimit(result.limit))
        .map((result) => {
          return {
            facilityTypeName: getFacilityTypeName(facilityProjection.facility.type),
            result,
          } as GuarantorResult;
        });
    }),
  );
}

function flattenFacilityProjection(projection: FacilityProjection): FacilityProjection[] {
  return [projection].concat(...projection.children.map((p) => flattenFacilityProjection(p)));
}

type GuarantorResult = {
  facilityTypeName: string;
  result: LimitResult<any>;
};

function getFacilityTypeName(facilityTypeName: string) {
  switch (facilityTypeName) {
    case 'contract-total-facility':
      return 'Facility';
    case 'relationship-facility':
      return 'Relationship';
    default:
      return facilityTypeName;
  }
}

function findDcl(facilities: PerCounterpartyTotalFacility[]) {
  return facilities
    .find((facility) => facility.defaultLimits?.some((l) => l.limitType === 'INSURANCE'))
    ?.defaultLimits.find((dl) => dl.limitType === 'INSURANCE').limit;
}

function mapExposure(
  exposure: Exposure<HomogenousObject> | Exposure<Entity & Classifiable>,
): (Exposure<HomogenousObject> | Exposure<Entity & Classifiable>) & {
  insuranceResult: any;
  creditResult: any;
  used: any;
} {
  const results: LimitResult<Classifiable>[] = exposure.results;
  return {
    ...exposure,
    insuranceResult: results.find(
      (r) => isTotalLimit(r.limit) && r.limit.limitType === 'INSURANCE',
    ),
    creditResult: results.find((r) => isTotalLimit(r.limit) && r.limit.limitType === 'CREDIT'),
    used: results[0].used,
  };
}

function mapExposureSet(exposureSet: ExposureSet): ExposureSet {
  return {
    ...exposureSet,
    // @ts-ignore
    results: exposureSet.results.map((r) => mapExposure(r)),
  } as HomogenousExposureSet | EntityExposureSet;
}

export function convert(projection: FacilityProjection): ViewProjection {
  return {
    ...projection,
    exposure: mapExposureSet(projection.exposure),
    facility: {
      ...(projection.facility as RelationshipFacility),
    },
    children: projection.children.map((c) => {
      return convertContractFacility(c, projection);
    }),
  };
}

type Facility2<T extends Facility> = Omit<T, 'children'>;

type GuarantorProjection = Omit<FacilityProjection, 'children' | 'facility'> & {
  facility: Facility2<RelationshipFacility | ContractTotalFacility>;
};

export type ViewProjection = Omit<FacilityProjection, 'children' | 'limit' | 'facility'> & {
  facility: Facility2<RelationshipFacility>;
  children: (Omit<FacilityProjection, 'children' | 'limit' | 'facility'> & {
    facility: Facility2<ContractTotalFacility>;
    sections: {
      products: (Omit<FacilityProjection, 'children' | 'limit' | 'facility'> & {
        facility: Facility2<ProductTotalFacility>;
      })[];
      perCounterparties: (Omit<FacilityProjection, 'children' | 'limit' | 'facility'> & {
        facility: Facility2<PerCounterpartyTotalFacility>;
      })[];
      other: Omit<FacilityProjection, 'children' | 'limit' | 'facility'> & {
        facility: Facility2<ConfigurableFacility>;
      };
      guarantors: GuarantorResult[];
    };
  })[];
};
