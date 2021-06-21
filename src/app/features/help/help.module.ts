import { ModuleWithProviders, NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { HelpItemListComponent } from '@app/features/help/components/help-item-list/help-item-list.component';
import { HelpPageComponent } from '@app/features/help/components/help-page/help-page.component';
import { GdsBladeModule } from '@greensill/gds-ui/blade';
import { GdsContainerModule } from '@greensill/gds-ui/container';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from './services/search.service';
import { NavigationService } from './services/navigation.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HelpModuleConfig } from './models/help-module-config.model';
import { GdsModalModule } from '@greensill/gds-ui/modal';
import { HelpIntroModalComponent } from './components/help-intro-modal/help-intro-modal.component';
import { GdsButtonModule } from '@greensill/gds-ui/button';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FullScreenModalComponent } from './components/full-screen-modal/full-screen-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { markedOptionsFactory } from './markdown.config';
import { HelpConfigService } from '@app/features/help/services/help-config.service';

@NgModule({
  declarations: [
    HelpComponent,
    HelpItemListComponent,
    HelpPageComponent,
    HelpIntroModalComponent,
    FullScreenModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    GdsContainerModule,
    GdsBladeModule,
    GdsModalModule,
    GdsButtonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
  exports: [HelpComponent],
  providers: [SearchService, NavigationService, HelpConfigService],
})
export class HelpModule {
  static forRoot(config: HelpModuleConfig): ModuleWithProviders<HelpModule> {
    return {
      ngModule: HelpModule,
      providers: [{ provide: HelpModuleConfig, useValue: config }],
    };
  }
}
