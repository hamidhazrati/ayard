import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EntitiesRoutingModule } from './entities-routing.module';
import { MatListModule } from '@angular/material/list';
import { ListEntitiesComponent } from '@entities/components/list-entities/list-entities.component';
import { ViewEntityComponent } from '@entities/components/view-entity/view-entity.component';
import { ViewMatchCandidateComponent } from '@entities/components/view-matchcandidate/view-matchcandidate.component';
import { ResolveEntityComponent } from '@entities/components/resolve-entity/resolve-entity.component';
import { CreateEntityComponent } from '@entities/components/create-entity/create-entity.component';
import { CreateEntityFormComponent } from '@entities/components/create-entity/create-entity-form/create-entity-form.component';
import { DunsFormatPipe } from '@entities/components/view-entity/duns-format.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { EntitySelectorComponent } from '@entities/components/entity-selector/entity-selector.component';
import { ResolveEntityFormComponent } from '@entities/components/resolve-entity/resolve-entity-form/resolve-entity-form.component';
import { MatchEntityComponent } from './components/match-entity/match-entity.component';
import { MatchEntityDialogComponent } from './components/match-entity/match-entity-dialog/match-entity-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WriteGuard } from '@entities/guards/write/write.guard';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EntityDialogueComponent } from './components/entity-dialogue/entity-dialogue.component';
import { EntityHistoryComponent } from './components/entity-history/entity-history.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    ListEntitiesComponent,
    ViewEntityComponent,
    ViewMatchCandidateComponent,
    CreateEntityComponent,
    ResolveEntityComponent,
    CreateEntityFormComponent,
    ResolveEntityFormComponent,
    MatchEntityComponent,
    MatchEntityDialogComponent,
    DunsFormatPipe,
    EntitySelectorComponent,
    EntityDialogueComponent,
    EntityHistoryComponent,
  ],
  imports: [
    ZXingScannerModule,
    CommonModule,
    SharedModule,
    EntitiesRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  providers: [WriteGuard],
  exports: [EntitySelectorComponent],
})
export class EntitiesModule {}
