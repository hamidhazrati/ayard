import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListContractsComponent } from '@app/features/contracts/components/list-contracts/list-contracts.component';
import { CreateContractComponent } from '@app/features/contracts/components/create-contract/create-contract.component';
import { ViewContractComponent } from '@app/features/contracts/components/view-contract/view-contract.component';

const routes: Routes = [
  {
    path: 'new',
    component: CreateContractComponent,
  },
  { path: ':id', component: ViewContractComponent },
  {
    path: '',
    component: ListContractsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractsRoutingModule {}
