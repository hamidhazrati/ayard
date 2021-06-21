import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPartnerComponent } from '@app/features/partners/components/list-partners/list-partners.component';
import { CreatePartnerComponent } from '@app/features/partners/components/create-partners/create-partner.component';
import { ViewPartnerComponent } from '@app/features/partners/components/view-partner/view-partner.component';

const routes: Routes = [
  {
    path: 'new',
    component: CreatePartnerComponent,
  },
  {
    path: ':id',
    component: ViewPartnerComponent,
  },
  {
    path: '',
    component: ListPartnerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnersRoutingModule {}
