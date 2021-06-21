import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductCategoryComponent } from '@app/features/product-categories/components/create-product-category/create-product-category.component';
import { ViewProductCategoryComponent } from '@app/features/product-categories/components/view-product-catgeory/view-product-category.component';

const routes: Routes = [
  {
    path: 'new',
    component: CreateProductCategoryComponent,
  },
  { path: ':id', component: ViewProductCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCategoriesRoutingModule {}
