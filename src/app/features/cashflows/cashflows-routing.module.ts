import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListCashflowsComponent } from '@app/features/cashflows/components/list-cashflows/list-cashflows.component';
import { ListCashflowFilesComponent } from './components/list-cashflow-files/list-cashflow-files.component';
import { ViewCashflowFilesComponent } from './components/view-cashflow-files/view-cashflow-files.component';
import { ViewOriginationProposalComponent } from '@app/features/cashflows/components/view-origination-proposal/view-origination-proposal.component';
import { ListOriginationProposalsComponent } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.component';

const routes: Routes = [
  {
    path: '',
    component: ListCashflowsComponent,
  },
  {
    path: 'files',
    component: ListCashflowFilesComponent,
  },
  {
    path: 'files/:id',
    component: ViewCashflowFilesComponent,
  },
  {
    path: 'files/:id/proposals',
    component: ViewOriginationProposalComponent,
  },
  {
    path: 'proposals',
    component: ListOriginationProposalsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashflowsRoutingModule {}
