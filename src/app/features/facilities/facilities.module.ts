import { FacilityPipe } from './pipes/facility.pipe';
import { FacilityTreeService } from './services/facility-tree.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { ListFacilitiesComponent } from '@app/features/facilities/components/list-facilities/list-facilities.component';
import { FacilitiesRoutingModule } from '@app/features/facilities/facilities-routing.module';
import { ViewFacilityComponent } from './components/view-facility/view-facility.component';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CounterpartiesTableComponent } from '@app/features/facilities/components/counterparties-table/counterparties-table.component';
import { CreateFacilityComponent } from './components/create-facility/create-facility.component';
import { MatTreeModule } from '@angular/material/tree';
import { CreateFacilityFormComponent } from './components/create-facility/create-facility-form/create-facility-form.component';
import { EntitiesModule } from '@entities/entities.module';
import { FacilityTreeComponent } from '@app/features/facilities/components/facility-tree/facility-tree.component';
import { FacilityComponent } from './components/facility/facility.component';
import { FacilityTreeViewComponent } from './components/facility-tree-view/facility-tree-view.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddContractFacilityDialogComponent } from './components/view-facility/add-contract-facility-dialog/add-contract-facility-dialog.component';
import { AddProductFacilityComponentDialogComponent } from './components/view-facility/add-product-facility-component-dialog/add-product-facility-component-dialog.component';
import { ContractsModule } from '@app/features/contracts/contracts.module';
import { ExposureResolveService } from '@app/features/facilities/resolvers/exposure-resolve.service';

@NgModule({
  declarations: [
    ListFacilitiesComponent,
    CounterpartiesTableComponent,
    ViewFacilityComponent,
    CreateFacilityComponent,
    CreateFacilityFormComponent,
    FacilityTreeComponent,
    FacilityComponent,
    AddContractFacilityDialogComponent,
    FacilityComponent,
    FacilityTreeViewComponent,
    AddProductFacilityComponentDialogComponent,
    FacilityPipe,
  ],
  imports: [
    CommonModule,
    FacilitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTableModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    NgStackFormsModule,
    SharedModule,
    EntitiesModule,
    GdsDataTableModule,
    ContractsModule,
  ],
  exports: [],
  providers: [ExposureResolveService, FacilityTreeService],
})
export class FacilitiesModule {}
