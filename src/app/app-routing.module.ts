import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import AppAuthenticationGuard from './auth';
import { ErrorComponent } from '@app/error.component';

const routes: Routes = [
  {
    path: 'partners',
    loadChildren: () => import('./features/partners/partners.module').then((m) => m.PartnersModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'contracts',
    loadChildren: () =>
      import('./features/contracts/contracts.module').then((m) => m.ContractsModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'entities',
    loadChildren: () => import('./features/entities/entities.module').then((m) => m.EntitiesModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'product-categories',
    loadChildren: () =>
      import('./features/product-categories/product-categories.module').then(
        (m) => m.ProductCategoriesModule,
      ),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'counterparty-roles',
    loadChildren: () =>
      import('./features/counterparty-roles/counterparty-roles.module').then(
        (m) => m.CounterpartyRolesModule,
      ),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'cashflows',
    loadChildren: () =>
      import('./features/cashflows/cashflows.module').then((m) => m.CashflowsModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: 'facilities',
    loadChildren: () =>
      import('./features/facilities/facilities.module').then((m) => m.FacilitiesModule),
  },
  {
    path: 'exceptions',
    loadChildren: () =>
      import('./features/exceptions/exceptions.module').then((m) => m.ExceptionsModule),
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AppAuthenticationGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AppAuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppAuthenticationGuard],
})
export class AppRoutingModule {}
