import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListExceptionsComponent } from './components/list-exceptions/list-exceptions.component';

const routes: Routes = [{ path: '', component: ListExceptionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExceptionsRoutingModule {}
