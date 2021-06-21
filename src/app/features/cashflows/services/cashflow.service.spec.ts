import { TestBed } from '@angular/core/testing';

import { CashflowService } from './cashflow.service';
import {
  cashflows,
  validCashflows,
  invalidCashflows,
  extractedContracts,
  extractedSellers,
  cashflow,
  cashflowFailures,
} from './cashflow.service.test-data';
import {
  CASHFLOW_UTLITIES_CONFIG,
  CashflowConfigService,
} from '@cashflows/services/cashflow-config.service';

describe('CashflowUtilitiesService', () => {
  let cashflowService: CashflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CASHFLOW_UTLITIES_CONFIG, useValue: CashflowConfigService }],
    });
    cashflowService = TestBed.inject(CashflowService);
  });

  it('should be created', () => {
    expect(cashflowService).toBeTruthy();
  });

  it('filters invalid cashflows', () => {
    const filteredInvalidCfs = cashflowService.getInvalidCashflows(cashflows);
    expect(filteredInvalidCfs).toStrictEqual(invalidCashflows);
  });

  it('filters failure cashflows', () => {
    expect(cashflowService.getCashflowFailures(cashflows)).toEqual(cashflowFailures);
  });

  it('filters valid cashflows', () => {
    expect(cashflowService.getValidCashflows(cashflows)).toEqual(validCashflows);
  });

  it('extracts contracts', () => {
    expect(cashflowService.getCashflowContracts(cashflows)).toEqual(extractedContracts);
  });

  it('extracts sellers', () => {
    expect(cashflowService.getUniqueSellers(cashflows)).toEqual(extractedSellers);
  });

  it('should convert a ratio value to a numerical value.', () => {
    expect(cashflowService.convertAdvanceRate(cashflow)).toBeTruthy();
    expect(cashflowService.convertAdvanceRate(cashflow).advanceRate).toBe(50);
  });

  it('should append missing messages in reason for failure for invalid cfs', () => {
    const filteredInvalidCfs = cashflowService.getInvalidCashflows(cashflows);
    expect(filteredInvalidCfs[0].reasonForFailure[1].message).toEqual('SUPPLIER_NOT_ON_CONTRACT');
  });

  it('should append missing messages in reason for failure for failures cfs', () => {
    const filteredFailureCfs = cashflowService.getCashflowFailures(cashflows);
    expect(filteredFailureCfs[0].reasonForFailure[0].message).toEqual('CONTRACT_NOT_FOUND');
    expect(filteredFailureCfs[0].reasonForFailure[1].message).toEqual('OMG');
  });
});
