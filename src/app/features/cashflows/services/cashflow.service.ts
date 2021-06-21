import { Inject, Injectable } from '@angular/core';
import { CashflowContract, CashflowSummary, Entity } from '@app/features/cashflows/models';
import { GdsCellAlign, GdsColumn, GdsColumnType } from '@greensill/gds-ui/data-table';
import { uniqBy } from 'lodash';
import {
  CASHFLOW_UTLITIES_CONFIG,
  ICashflowUtilitiesServiceConfig,
} from '@cashflows/services/cashflow-config.service';
import { BehaviorSubject } from 'rxjs';

export const cashflowsTableColumns: GdsColumn[] = [
  {
    prop: 'entityOneTransformed',
    name: 'Related Counterparty',
    type: GdsColumnType.InnerHTML,
    columnWidth: 190,
  },
  {
    prop: 'entityTwoTransformed',
    name: 'Primary Counterparty',
    type: GdsColumnType.InnerHTML,
    columnWidth: 190,
  },
  { prop: 'documentReference', name: 'Invoice ID', columnWidth: 120 },
  { prop: 'issueDate', type: GdsColumnType.Date, columnWidth: 110 },
  { prop: 'originalDueDate', type: GdsColumnType.Date, name: 'Due Date', columnWidth: 110 },
  { prop: 'currency', name: 'CCY', columnWidth: 70 },
  {
    prop: 'originalValue',
    name: 'Invoice Amount',
    type: GdsColumnType.Currency,
    cellAlign: GdsCellAlign.Right,
    columnWidth: 150,
  },
  {
    prop: 'fundingAmount',
    name: 'Fmv Amount',
    type: GdsColumnType.Currency,
    cellAlign: GdsCellAlign.Right,
    columnWidth: 130,
  },
  { prop: 'advanceRate', name: 'Fmv Rate', cellAlign: GdsCellAlign.Right, columnWidth: 110 },
  { prop: 'bufferPeriod', cellAlign: GdsCellAlign.Right, columnWidth: 130 },
  { prop: 'acceptanceDate', type: GdsColumnType.Date, columnWidth: 150 },
  {
    prop: 'maturityDate',
    name: 'Expected Payment Date',
    type: GdsColumnType.Date,
    columnWidth: 200,
  },
  { prop: 'state', name: 'Status', type: GdsColumnType.TitleCase, columnWidth: 100 },
];

@Injectable({
  providedIn: 'root',
})
export class CashflowService {
  public internalApproval$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    @Inject(CASHFLOW_UTLITIES_CONFIG)
    private cashflowServiceConfig: ICashflowUtilitiesServiceConfig,
  ) {}

  convertAdvanceRate(cashflowSummary: CashflowSummary): CashflowSummary {
    return {
      ...cashflowSummary,
      advanceRate: Number.isInteger(Number(cashflowSummary.advanceRate))
        ? cashflowSummary.advanceRate
        : cashflowSummary.advanceRate * 100,
    };
  }

  getValidCashflows(cfs: CashflowSummary[]): CashflowSummary[] {
    return cfs.filter(
      (cashflowSummary) =>
        !this.cashflowServiceConfig.invalidStates[cashflowSummary.state] &&
        !this.cashflowServiceConfig.failureStates[cashflowSummary.state],
    );
  }

  getInvalidCashflows(cfs: CashflowSummary[]): CashflowSummary[] {
    return cfs
      .filter((cashflowSummary) => this.cashflowServiceConfig.invalidStates[cashflowSummary.state])
      .map((cashflowSummary) => {
        cashflowSummary = this.appendMissingFailureMessage(cashflowSummary);
        cashflowSummary = this.convertAdvanceRate(cashflowSummary);
        return cashflowSummary;
      });
  }

  getCashflowFailures(cfs: CashflowSummary[]): CashflowSummary[] {
    return cfs
      .filter((cashflowSummary) => this.cashflowServiceConfig.failureStates[cashflowSummary.state])
      .map((cashflowSummary) => {
        cashflowSummary.hasFailures = true;
        cashflowSummary = this.appendMissingFailureMessage(cashflowSummary);
        cashflowSummary = this.convertAdvanceRate(cashflowSummary);
        return cashflowSummary;
      });
  }

  private appendMissingFailureMessage(cfSummary: CashflowSummary): CashflowSummary {
    cfSummary.reasonForFailure.forEach((failure) => {
      if (failure.message === null) {
        const newMessage = this.cashflowServiceConfig.invalidStates[failure.code];
        if (newMessage) {
          failure.message = newMessage;
        } else {
          failure.message = failure.code;
        }
      }
    });
    return cfSummary;
  }

  getCashflowContracts(cfs: CashflowSummary[]): CashflowContract[] {
    const cashflowContracts: CashflowContract[] = [];

    cfs.forEach((cashflowSummary) => {
      if (
        cashflowSummary.contract &&
        !cashflowContracts.map((c) => c.id).includes(cashflowSummary.contract?.id)
      ) {
        cashflowContracts.push({
          id: cashflowSummary.contract?.id,
          name: cashflowSummary.contract?.name,
        });
      }
    });

    return cashflowContracts;
  }

  getUniqueSellers(cfSummaries: CashflowSummary[]): Entity[] {
    const sellerEntities: Entity[] = [];
    cfSummaries.forEach((cfSummary) => {
      if (cfSummary.entityOne?.role === this.cashflowServiceConfig.sellerIdentifier) {
        sellerEntities.push(cfSummary.entityOne);
      } else if (cfSummary.entityTwo?.role === this.cashflowServiceConfig.sellerIdentifier) {
        sellerEntities.push(cfSummary.entityTwo);
      }
    });
    return uniqBy(sellerEntities, 'id');
  }
}
