import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProductCategoryComponent } from '@app/features/product-categories/components/create-product-category/create-product-category.component';
import { CreateProductCategoryFormComponent } from '@app/features/product-categories/components/create-product-category/create-product-category-form/create-product-category-form.component';
import { ProductCategoriesRoutingModule } from '@app/features/product-categories/product-categories-routing.module';
import { ProductRoutingModule } from '@app/features/products/product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { ViewProductCategoryComponent } from '@app/features/product-categories/components/view-product-catgeory/view-product-category.component';
import { ProductsModule } from '../products/products.module';

@NgModule({
  declarations: [
    CreateProductCategoryComponent,
    CreateProductCategoryFormComponent,
    ViewProductCategoryComponent,
  ],
  imports: [
    CommonModule,
    ProductCategoriesRoutingModule,
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
    MatSlideToggleModule,
    MatDialogModule,
    SharedModule,
    ProductsModule,
  ],
})
export class ProductCategoriesModule {}
