import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateCounterpartyRoleComponent, ListCounterpartyRolesComponent } from './index';

const routes: Routes = [
  {
    path: 'new',
    component: CreateCounterpartyRoleComponent,
  },
  {
    path: ':id',
    component: ListCounterpartyRolesComponent,
  },
  {
    path: '',
    component: ListCounterpartyRolesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterpartyRolesRoutingModule {}
