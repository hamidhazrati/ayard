import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CashflowsRoutingModule } from '@app/features/cashflows/cashflows-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@app/shared/shared.module';
import { ListCashflowsComponent } from '@app/features/cashflows/components/list-cashflows/list-cashflows.component';
import { UploadCashflowDialogComponent } from '@app/features/cashflows/components/list-cashflow-files/upload-cashflow-dialog/upload-cashflow-dialog.component';
import { ListCashflowFilesComponent } from '@app/features/cashflows/components/list-cashflow-files/list-cashflow-files.component';
import { ViewCashflowFilesComponent } from '@app/features/cashflows/components/view-cashflow-files/view-cashflow-files.component';
import { InternalApprovalDialogComponent } from '@cashflows/components/view-origination-proposal/internal-approval-dialog/internal-approval-dialog.component';
import { GdsDataTableModule } from '@greensill/gds-ui/data-table';
import { CashflowsTableComponent } from './components/view-cashflow-files/cashflows-table/cashflows-table.component';
import { InvalidCashflowsTableComponent } from './components/view-cashflow-files/invalid-cashflows-table/invalid-cashflows-table.component';
import { RejectCashflowDialogComponent } from './components/view-cashflow-files/reject-cashflow-dialog/reject-cashflow-dialog.component';
import { OriginationProposalDialogComponent } from './components/view-cashflow-files/origination-proposal-dialog/origination-proposal-dialog.component';
import { ViewOriginationProposalComponent } from './components/view-origination-proposal/view-origination-proposal.component';
import { ListOriginationProposalsComponent } from '@app/features/cashflows/components/list-origination-proposals/list-origination-proposals.component';
import { ProposalTableComponent } from './components/view-origination-proposal/proposal-table/proposal-table.component';
import { UnacceptedCashflowDialogueComponent } from './components/view-origination-proposal/proposal-table/unaccepted-cashflow-dialogue/unaccepted-cashflow-dialogue.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { InvalidCashflowsProposalTableComponent } from '@app/features/cashflows/components/view-origination-proposal/invalid-cashflows-proposal-table/invalid-cashflows-proposal-table.component';
import { ExportDialogComponent } from '@app/features/cashflows/components/view-origination-proposal/export-dialog/export-dialog.component';
import { SubmitToTradeDialogComponent } from '@app/features/cashflows/components/view-origination-proposal/submit-to-trade-dialog/submit-to-trade-dialog.component';
import {
  CASHFLOW_UTLITIES_CONFIG,
  CashflowConfigService,
} from '@cashflows/services/cashflow-config.service';
import { OrdinalFormatPipe } from '@app/features/cashflows/components/view-origination-proposal/ordinal-format.pipe';
import { ProductsModule } from '@app/features/products/products.module';

@NgModule({
  declarations: [
    CashflowsTableComponent,
    ExportDialogComponent,
    InvalidCashflowsProposalTableComponent,
    InvalidCashflowsTableComponent,
    ListCashflowFilesComponent,
    ListCashflowsComponent,
    ListOriginationProposalsComponent,
    OrdinalFormatPipe,
    OriginationProposalDialogComponent,
    ProposalTableComponent,
    RejectCashflowDialogComponent,
    SubmitToTradeDialogComponent,
    UnacceptedCashflowDialogueComponent,
    UploadCashflowDialogComponent,
    ViewCashflowFilesComponent,
    ViewOriginationProposalComponent,
    InternalApprovalDialogComponent,
  ],
  imports: [
    CashflowsRoutingModule,
    CommonModule,
    FormsModule,
    GdsDataTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ProductsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [],
  providers: [{ provide: CASHFLOW_UTLITIES_CONFIG, useValue: CashflowConfigService }],
})
export class CashflowsModule {}
