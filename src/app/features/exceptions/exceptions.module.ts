import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '@app/shared/shared.module';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { GdsTagModule } from '@greensill/gds-ui/tag';
import { ListExceptionsComponent } from './components/list-exceptions/list-exceptions.component';
import { ViewExceptionComponent } from './components/view-exception/view-exception.component';
import { ExceptionsRoutingModule } from './exceptions-routing.module';
import { ResolveExceptionsComponent } from './components/resolve-exceptions/resolve-exceptions.component';
import { ExceptionSidebarTitleComponent } from './components/exception-sidebar-title/exception-sidebar-title.component';

@NgModule({
  declarations: [
    ListExceptionsComponent,
    ViewExceptionComponent,
    ResolveExceptionsComponent,
    ExceptionSidebarTitleComponent,
  ],
  imports: [
    CommonModule,
    ExceptionsRoutingModule,
    GdsDataTableModule,
    GdsTagModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    SharedModule,
  ],
})
export class ExceptionsModule {}
