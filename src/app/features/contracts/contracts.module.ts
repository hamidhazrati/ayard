import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContractComponent } from '@app/features/contracts/components/create-contract/create-contract.component';
import { ViewContractComponent } from '@app/features/contracts/components/view-contract/view-contract.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractsRoutingModule } from '@app/features/contracts/contracts-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { ProductSelectorComponent } from './components/create-contract/product-selector/product-selector.component';
import { SharedModule } from '@app/shared/shared.module';
import { CounterpartyFormComponent } from './components/create-contract/counterparty-form/counterparty-form.component';
import { ContractFieldsFormComponent } from '@app/features/contracts/components/create-contract/contract-fields-form/contract-fields-form.component';
import { ListContractsComponent } from './components/list-contracts/list-contracts.component';
import { MatSortModule } from '@angular/material/sort';
import { PricingAttributesFormComponent } from './components/shared/pricing-attributes-form/pricing-attributes-form.component';
import { CurrencyPricingComponent } from './components/create-contract/currency-pricing/currency-pricing.component';
import { CurrencyAttributesCardComponent } from './components/shared/currency-attributes-card/currency-attributes-card.component';
import { PricingCurrencyFormComponent } from './components/shared/pricing-currency-form/pricing-currency-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EntitiesModule } from '../entities/entities.module';
import { ProductsModule } from '../products/products.module';
import { MatChipsModule } from '@angular/material/chips';
import { CalendarSelectorComponent } from './components/shared/calendar-selector/calendar-selector.component';
import { PartnersModule } from '../partners/partners.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FacilitySelectorComponent } from '@app/features/contracts/components/create-contract/facility-selector/facility-selector.component';
import { PortalModule } from '@angular/cdk/portal';
import { CounterpartyListComponent } from '@app/features/contracts/components/shared/counterparty-list/counterparty-list.component';
import { AddCounterpartyDialogComponent } from '@app/features/contracts/components/shared/add-counterparty-dialog/add-counterparty-dialog.component';
import { BasicCounterpartyFormComponent } from '@app/features/contracts/components/shared/basic-counterparty-form/basic-counterparty-form.component';
import { EditCounterpartyReferencesDialogComponent } from '@app/features/contracts/components/shared/edit-counterparty-references-dialog/edit-counterparty-references-dialog.component';
import { AddLimitDialogComponent } from '@app/features/contracts/components/shared/add-limit-dialog/add-limit-dialog.component';
import { CreditApprovalDialogComponent } from '@app/features/contracts/components/shared/credit-approval-dialog/credit-approval-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditCounterpartyMarginDialogComponent } from './components/shared/edit-counterparty-margin-dialog/edit-counterparty-margin-dialog.component';
import { ManageCounterpartyBanksComponent } from './components/shared/manage-counterparty-banks/manage-counterparty-banks.component';
import { EditContractDialogComponent } from './components/shared/edit-countract-dialog/edit-contract-dialog.component';
import { DuplicateChecksComponent } from '@app/features/contracts/components/shared/duplicate-check-fields/duplicate-checks.component';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { CounterpartyGroupsPerRoleTypeAndRoleComponent } from '@app/features/contracts/components/manage-counterparties/counterparty-groups-per-role-type-and-role.component';
import { CounterpartyGroupsPerRoleComponent } from './components/manage-counterparties/counterparty-groups-per-role/counterparty-groups-per-role.component';
import { MatTabsModule } from '@angular/material/tabs';

export const moduleImports = [
  CommonModule,
  SharedModule,
  ContractsRoutingModule,
  ReactiveFormsModule,
  MatTableModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDividerModule,
  MatIconModule,
  FormsModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatListModule,
  MatSortModule,
  MatDialogModule,
  EntitiesModule,
  ProductsModule,
  MatChipsModule,
  PartnersModule,
  MatExpansionModule,
  PortalModule,
  MatMenuModule,
  OverlayModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatPaginatorModule,
  GdsDataTableModule,
  MatTabsModule,
];

export const moduleDeclarations = [
  CreateContractComponent,
  ViewContractComponent,
  ProductSelectorComponent,
  ContractFieldsFormComponent,
  PricingAttributesFormComponent,
  PricingCurrencyFormComponent,
  ListContractsComponent,
  CounterpartyFormComponent,
  CurrencyPricingComponent,
  CurrencyAttributesCardComponent,
  CalendarSelectorComponent,
  FacilitySelectorComponent,
  CounterpartyListComponent,
  AddCounterpartyDialogComponent,
  BasicCounterpartyFormComponent,
  EditCounterpartyReferencesDialogComponent,
  EditCounterpartyMarginDialogComponent,
  ManageCounterpartyBanksComponent,
  AddLimitDialogComponent,
  CreditApprovalDialogComponent,
  DuplicateChecksComponent,
  EditContractDialogComponent,
  CounterpartyGroupsPerRoleTypeAndRoleComponent,
  CounterpartyGroupsPerRoleComponent,
];

@NgModule({
  declarations: [moduleDeclarations],
  imports: [moduleImports],
  exports: [ProductSelectorComponent],
})
export class ContractsModule {}
