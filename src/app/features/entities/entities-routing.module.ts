import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListEntitiesComponent } from '@entities/components/list-entities/list-entities.component';
import { ViewEntityComponent } from '@entities/components/view-entity/view-entity.component';
import { CreateEntityComponent } from '@entities/components/create-entity/create-entity.component';
import { ResolveEntityComponent } from '@entities/components/resolve-entity/resolve-entity.component';
import { MatchEntityComponent } from '@entities/components/match-entity/match-entity.component';
import { ViewMatchCandidateComponent } from './components/view-matchcandidate/view-matchcandidate.component';
import { WriteGuard } from '@entities/guards/write/write.guard';

const routes: Routes = [
  {
    path: 'resolve',
    component: ResolveEntityComponent,
  },
  {
    path: 'match',
    component: MatchEntityComponent,
  },
  {
    path: 'matchcandidates/:id',
    component: ViewMatchCandidateComponent,
  },
  {
    path: 'new',
    component: CreateEntityComponent,
    canActivate: [WriteGuard],
  },
  { path: ':id', component: ViewEntityComponent },

  {
    path: '',
    component: ListEntitiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule {}
