import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from '@app/features/products/components/create-product/create-product.component';
import { ViewProductComponent } from '@app/features/products/components/view-product/view-product.component';
import { ListProductsComponent } from '@app/features/products/components/list-products/list-products.component';

const routes: Routes = [
  {
    path: 'new',
    component: CreateProductComponent,
  },
  { path: ':id', component: ViewProductComponent },
  { path: '', component: ListProductsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
