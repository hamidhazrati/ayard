import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFacilitiesComponent } from '@app/features/facilities/components/list-facilities/list-facilities.component';
import { ViewFacilityComponent } from '@app/features/facilities/components/view-facility/view-facility.component';
import { CreateFacilityComponent } from '@app/features/facilities/components/create-facility/create-facility.component';
import { FacilityComponent } from '@app/features/facilities/components/facility/facility.component';
import { ExposureResolveService } from '@app/features/facilities/resolvers/exposure-resolve.service';

const routes: Routes = [
  {
    path: ':id/view',
    component: FacilityComponent,
    resolve: {
      exposure: ExposureResolveService,
    },
  },
  { path: 'new', component: CreateFacilityComponent },
  { path: ':id', component: ViewFacilityComponent },
  { path: '', component: ListFacilitiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilitiesRoutingModule {}
