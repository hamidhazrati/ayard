import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductRoutingModule } from '@app/features/products/product-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateProductFormComponent } from './components/create-product/create-product-form/create-product-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { PortalModule } from '@angular/cdk/portal';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { CounterpartyRoleSideBarComponent } from './components/create-product/counterparty-role-side-bar/counterparty-role-side-bar.component';
import { CounterpartyRoleListComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-list/counterparty-role-list.component';
import { CounterpartyRoleConfiguratorComponent } from '@app/features/products/components/create-product/counterparty-role-side-bar/counterparty-role-configurator/counterparty-role-configurator.component';
import { CounterpartyRoleFormBuilder } from '@app/features/products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import { CreateProductComponent } from '@app/features/products/components/create-product/create-product.component';
import { ListProductsComponent } from '@app/features/products/components/list-products/list-products.component';
import { ViewProductComponent } from '@app/features/products/components/view-product/view-product.component';
import { SharedModule } from '@app/shared/shared.module';
import { RuleSideBarComponent } from './components/create-product/rule-side-bar/rule-side-bar.component';
import { RuleFormComponent } from './components/rule-form/rule-form.component';
import { ViewRuleComponent } from './components/view-rule/view-rule.component';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { ProductParameterSideBarComponent } from '@app/features/products/components/create-product/productparameter-side-bar/product-parameter-side-bar.component';
import { NumberProductParameterComponent } from '@app/features/products/components/create-product/number-product-parameter/number-product-parameter.component';
import { ProductParameterOptionComponent } from './components/create-product/product-parameter-option/product-parameter-option.component';

export const productsModuleDeclarations = [
  CreateProductComponent,
  ListProductsComponent,
  ViewProductComponent,
  CreateProductFormComponent,
  CounterpartyRoleListComponent,
  CounterpartyRoleConfiguratorComponent,
  RuleFormComponent,
  ViewRuleComponent,
  ProductParameterSideBarComponent,
  CounterpartyRoleSideBarComponent,
  RuleSideBarComponent,
  NumberProductParameterComponent,
  ProductParameterOptionComponent,
];

export const productsModuleImports = [
  CommonModule,
  ProductRoutingModule,
  ReactiveFormsModule,
  MatTableModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatStepperModule,
  MatTableModule,
  MatTooltipModule,
  NgStackFormsModule,
  ProductRoutingModule,
  ReactiveFormsModule,
  MatExpansionModule,
  PortalModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatTabsModule,
  SharedModule,
  GdsDataTableModule,
];

@NgModule({
  declarations: [productsModuleDeclarations],
  imports: [productsModuleImports],
  exports: [ViewRuleComponent],
  providers: [CounterpartyRoleFormBuilder],
})
export class ProductsModule {}
