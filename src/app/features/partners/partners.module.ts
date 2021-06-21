import { NgModule } from '@angular/core';
import { PartnersRoutingModule } from '@app/features/partners/partners-routing.module';
import { ListPartnerComponent } from '@app/features/partners/components/list-partners/list-partners.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CreatePartnerComponent } from '@app/features/partners/components/create-partners/create-partner.component';
import { EntitiesModule } from '@entities/entities.module';
import { ViewPartnerComponent } from '@app/features/partners/components/view-partner/view-partner.component';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';

export const moduleImports = [CommonModule, SharedModule, PartnersRoutingModule, EntitiesModule];

export const moduleDeclarations = [
  ListPartnerComponent,
  CreatePartnerComponent,
  ViewPartnerComponent,
];

@NgModule({
  declarations: moduleDeclarations,
  imports: [
    moduleImports,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    EntitiesModule,
    GdsDataTableModule,
  ],
})
export class PartnersModule {}
