import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CounterpartyRolesRoutingModule } from './counterparty-roles-routing.module';
import { CreateCounterpartyRoleComponent, ListCounterpartyRolesComponent } from './index';
import { CounterpartyRoleFormBuilder } from '../products/counterparty-role-form-builder/counterparty-role-form-builder.service';
import { SharedModule } from '../../shared/shared.module';
import { CreateCounterpartyRoleFormComponent } from './components/create-counterparty-role/create-counterparty-role-form/create-counterparty-role-form.component';

@NgModule({
  declarations: [
    CreateCounterpartyRoleComponent,
    ListCounterpartyRolesComponent,
    CreateCounterpartyRoleFormComponent,
  ],
  imports: [
    CommonModule,
    CounterpartyRolesRoutingModule,
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
    SharedModule,
  ],
  exports: [],
  providers: [CounterpartyRoleFormBuilder],
})
export class CounterpartyRolesModule {}
