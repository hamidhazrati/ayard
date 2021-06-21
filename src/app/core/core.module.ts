import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { KeycloakService } from 'keycloak-angular';
import { initializer } from './core.init';
import { LayoutService } from './services/layout.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [ConfigService, KeycloakService, LayoutService],
    },
  ],
})
export class CoreModule {}
