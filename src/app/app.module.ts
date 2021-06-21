import { NgModule } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@app/core/core.module';
import { AppRoutingModule } from '@app/app-routing.module';

import { AppComponent } from '@app/app.component';
// Feature Modules
import { SharedModule } from '@app/shared/shared.module';
import { ProductsModule } from '@app/features/products/products.module';
import { EntitiesModule } from '@entities/entities.module';
import { CounterpartyRolesModule } from '@app/features/counterparty-roles/counterparty-roles.module';
import { DashboardModule } from '@app/features/dashboard/dashboard.module';
import { ContractsModule } from '@app/features/contracts/contracts.module';
import { CashflowsModule } from '@app/features/cashflows/cashflows.module';
import { KeycloakAngularModule } from 'keycloak-angular';
import { PartnersModule } from '@app/features/partners/partners.module';
import { FacilitiesModule } from '@app/features/facilities/facilities.module';
import { ExceptionsModule } from '@app/features/exceptions/exceptions.module';
import { ErrorComponent } from '@app/error.component';
import { HelpModule } from '@app/features/help/help.module';

@NgModule({
  declarations: [AppComponent, ErrorComponent],
  imports: [
    KeycloakAngularModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ProductsModule,
    ContractsModule,
    EntitiesModule,
    CounterpartyRolesModule,
    DashboardModule,
    CashflowsModule,
    PartnersModule,
    FacilitiesModule,
    ExceptionsModule,
    HelpModule.forRoot({ configPath: 'assets/help/help.config.json' }),
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatSpinner],
})
export class AppModule {}
