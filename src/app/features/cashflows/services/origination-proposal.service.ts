import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {
  CashflowDataService,
  CashflowSummariesParams,
} from '@cashflows/services/cashflow-data.service';
import { catchError } from 'rxjs/operators';
import { CashflowFile, CashflowSummary, CashflowTotal } from '@cashflows/models';
import { CashflowFileFacility } from '@cashflows/models/cashflow-file';
import { ProposalCashflowsWithFacility } from '@cashflows/models/cashflow-summary';
import {
  CASHFLOW_UTLITIES_CONFIG,
  ICashflowUtilitiesServiceConfig,
} from '@cashflows/services/cashflow-config.service';
import { CashflowService } from '@cashflows/services/cashflow.service';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

const TOTALS_EXCLUDED_STATES: string[] = [
  'INVALID',
  'REJECTED',
  'RECEIVED',
  'VALIDATED',
  'CASHFLOW_PROCESSING_ERROR',
];
export const SUMMARIES_EXCLUDED_STATES: string[] = ['RECEIVED', 'VALIDATED'];

@Injectable({
  providedIn: 'root',
})
export class OriginationProposalService {
  constructor(
    private cashflowDataService: CashflowDataService,
    @Inject(CASHFLOW_UTLITIES_CONFIG)
    private cashflowServiceConfig: ICashflowUtilitiesServiceConfig,
    private cashflowService: CashflowService,
  ) {}

  public getViewOriginationProposalData(
    cashflowFileId: string,
  ): Observable<{
    cashflowFile: CashflowFile;
    cashflowTotals: CashflowTotal[];
    cashflowSummaries: CashflowSummary[];
    cashflowFileFacilities: CashflowFileFacility[];
  }> {
    const summariesParams: CashflowSummariesParams = {
      cashflowFileId,
      includeAllFailuresInFile: true,
      excludedStates: SUMMARIES_EXCLUDED_STATES,
    };

    return forkJoin({
      cashflowFile: this.cashflowDataService
        .getCashflowFile(cashflowFileId)
        .pipe(catchError((error) => [])),
      cashflowTotals: this.cashflowDataService
        .getCashflowTotalsByCashflowFileId(cashflowFileId, TOTALS_EXCLUDED_STATES)
        .pipe(catchError((error) => [])),
      cashflowSummaries: this.cashflowDataService
        .getCashflowSummaries(summariesParams)
        .pipe(catchError((error) => [])),
      cashflowFileFacilities: this.cashflowDataService
        .getFacilitiesForCashflowFile(cashflowFileId)
        .pipe(catchError((error) => [])),
    });
  }

  public getCashflowTotalForCurrencyAndContract(
    cashflowTotals: CashflowTotal[],
    currency: string,
    contractId: string,
  ): CashflowTotal {
    return cashflowTotals?.find(
      (cf: CashflowTotal) => currency === cf.currency && contractId === cf.contractId,
    );
  }

  public getProposalCashflowsWithFacilitiesForCurrencyAndContract(
    proposalCashflowsWithFacilities: ProposalCashflowsWithFacility[],
    currency: string,
    contractId: string,
  ): ProposalCashflowsWithFacility[] {
    const tabProposalCashflowsWithFacilities: ProposalCashflowsWithFacility[] = [];

    proposalCashflowsWithFacilities
      ?.filter((pc) => currency === pc.currency && contractId === pc.contractId)
      .forEach((pc) => tabProposalCashflowsWithFacilities.push(pc));

    return tabProposalCashflowsWithFacilities;
  }

  public getCashflowSummariesWithFacilities(
    cashflowSummaries: CashflowSummary[],
    cashflowFileFacilities: CashflowFileFacility[],
  ): ProposalCashflowsWithFacility[] {
    const proposalCashflows: ProposalCashflowsWithFacility[] = [];

    cashflowSummaries
      .filter(
        (cf) =>
          !this.cashflowServiceConfig.invalidStates[cf.state] &&
          !this.cashflowServiceConfig.failureStates[cf.state],
      )
      .forEach((cf) => {
        if (cf.entityOne.role === this.cashflowServiceConfig.accountDebtorIdentifier) {
          if (this.alreadyGrouped(proposalCashflows, cf)) {
            const i = this.getIndexUsingCashflow(proposalCashflows, cf);
            proposalCashflows[i].cashflows.push(cf);
            proposalCashflows[i].noOfCashflows++;
            proposalCashflows[i].insuranceType = cf.insuranceType;
            proposalCashflows[i].fundingAmount = this.roundToTwoDecimals(
              proposalCashflows[i].fundingAmount + cf.fundingAmount,
            );
            proposalCashflows[i].latestMaturityDate = this.getLatestDate(
              proposalCashflows[i].latestMaturityDate,
              cf.maturityDate,
            );
          } else {
            proposalCashflows.push({
              accountDebtorEntityId: cf.entityOne.id,
              accountDebtorName: cf.entityOne.name,
              contractId: cf.contract.id,
              currency: cf.currency,
              cashflows: [cf],
              noOfCashflows: 1,
              fundingAmount: cf.fundingAmount,
              currentOutstanding: 0,
              latestMaturityDate: cf.maturityDate,
              limit: 0,
              totalIfPurchased: 0,
              utilisation: 0,
              availableLimit: 0,
              insuranceAvailable: 0,
              insuranceLimit: 0,
              insuranceLimitType: 'DCL',
              insuranceType: cf.insuranceType,
            });
          }
        }
      });

    cashflowFileFacilities.forEach((cff) => {
      if (this.facilityHasCashflow(proposalCashflows, cff)) {
        const i = this.getIndexUsingFacility(proposalCashflows, cff);
        proposalCashflows[i].limit = this.roundToTwoDecimals(cff.limit);
        proposalCashflows[i].insuranceAvailable = this.roundToTwoDecimals(cff.insuranceAvailable);
        proposalCashflows[i].insuranceLimitType = cff.insuranceLimitType;
        proposalCashflows[i].insuranceLimit = this.roundToTwoDecimals(cff.insuranceLimit);
        proposalCashflows[i].totalIfPurchased = this.roundToTwoDecimals(cff.exposure);
        proposalCashflows[i].currentOutstanding = this.roundToTwoDecimals(
          cff.exposure - proposalCashflows[i].fundingAmount,
        );
        proposalCashflows[i].utilisation = this.roundToTwoDecimals(
          (cff.exposure / cff.limit) * 100,
        );
        proposalCashflows[i].availableLimit = this.roundToTwoDecimals(cff.limit - cff.exposure);
      }
    });

    return proposalCashflows;
  }

  public getLatestDate(firstDateString: string, secondDateString: string): string {
    let firstDate;
    let secondDate;

    try {
      firstDate = Date.parse(firstDateString);
    } catch (e) {
      firstDate = NaN;
    }

    try {
      secondDate = Date.parse(secondDateString);
    } catch (e) {
      secondDate = NaN;
    }

    if (isNaN(secondDate) && isNaN(firstDate)) return '';

    if (isNaN(secondDate) && !isNaN(firstDate)) return firstDateString;

    if (isNaN(firstDate)) return secondDateString;

    if (secondDate > firstDate) return secondDateString;

    return firstDateString;
  }

  public getInvalidCashflowsForTab(cf: CashflowSummary[]): CashflowSummary[] {
    const invalidCfs = this.cashflowService.getInvalidCashflows(cf);
    const failureCfs = this.cashflowService.getCashflowFailures(cf);
    return [...invalidCfs, ...failureCfs];
  }

  public getUniqueSellersForTab(cf: CashflowSummary[], currency: string, contractId: string) {
    const cashflowsForTab = this.getCashflowSummariesForCurrencyAndContract(
      cf,
      currency,
      contractId,
    );

    return this.cashflowService.getUniqueSellers(cashflowsForTab);
  }

  public getMaxMaturityDateForTab(
    cashflowSummaries: CashflowSummary[],
    currency: string,
    contractId: string,
  ): string {
    const cashflowsForTab = this.getCashflowSummariesForCurrencyAndContract(
      cashflowSummaries,
      currency,
      contractId,
    );

    return cashflowsForTab
      .map((cfs) => cfs.maturityDate)
      .filter((mDate) => isNotNullOrUndefined(mDate))
      ?.sort()
      .reverse()[0];
  }

  public getMaxTenor(cashflowSummaries: CashflowSummary[], maturityDateStr: string): number {
    const maturityDate = new Date(maturityDateStr);
    const acceptanceDate = new Date(cashflowSummaries[0]?.acceptanceDate);

    return Math.floor(
      (Date.UTC(maturityDate.getFullYear(), maturityDate.getMonth(), maturityDate.getDate()) -
        Date.UTC(
          acceptanceDate.getFullYear(),
          acceptanceDate.getMonth(),
          acceptanceDate.getDate(),
        )) /
        (1000 * 60 * 60 * 24),
    );
  }

  private getCashflowSummariesForCurrencyAndContract(
    cashflowSummaries: CashflowSummary[],
    currency: string,
    contractId: string,
  ): CashflowSummary[] {
    const tabCashflowSummaries: CashflowSummary[] = [];

    cashflowSummaries
      ?.filter((cf) => currency === cf.currency && contractId === cf.contract?.id)
      .forEach((cf) => tabCashflowSummaries.push(cf));

    return tabCashflowSummaries;
  }

  private alreadyGrouped(
    proposalCashflows: ProposalCashflowsWithFacility[],
    cashflowSummary: CashflowSummary,
  ) {
    if (this.getIndexUsingCashflow(proposalCashflows, cashflowSummary) === -1) return false;

    return true;
  }

  private getIndexUsingCashflow(
    proposalCashflows: ProposalCashflowsWithFacility[],
    cashflowSummary: CashflowSummary,
  ) {
    return proposalCashflows.findIndex(
      (pc) =>
        pc.accountDebtorEntityId === cashflowSummary.entityOne.id &&
        pc.contractId === cashflowSummary.contract.id &&
        pc.currency === cashflowSummary.currency,
    );
  }

  private facilityHasCashflow(
    proposalCashflows: ProposalCashflowsWithFacility[],
    cashflowFileFacilities: CashflowFileFacility,
  ): boolean {
    if (this.getIndexUsingFacility(proposalCashflows, cashflowFileFacilities) === -1) return false;

    return true;
  }

  private getIndexUsingFacility(
    proposalCashflows: ProposalCashflowsWithFacility[],
    cashflowFileFacilities: CashflowFileFacility,
  ): number {
    return proposalCashflows.findIndex(
      (pc) =>
        pc.accountDebtorEntityId === cashflowFileFacilities.entityId &&
        pc.contractId === cashflowFileFacilities.contractId &&
        pc.currency === cashflowFileFacilities.currency,
    );
  }

  private roundToTwoDecimals(num: number): number {
    return parseFloat((Math.round(num * 100) / 100).toFixed(2));
  }
}
