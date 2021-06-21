import { TestBed } from '@angular/core/testing';
import { OriginationProposalService } from './origination-proposal.service';
import { CashflowDataService } from '@cashflows/services/cashflow-data.service';
import { MockService } from 'ng-mocks';
import Mocked = jest.Mocked;
import {
  CASHFLOW_UTLITIES_CONFIG,
  CashflowConfigService,
} from '@cashflows/services/cashflow-config.service';

describe('OriginationProposal.ServiceService', () => {
  let service: OriginationProposalService;
  let cashflowService: Mocked<CashflowDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: CASHFLOW_UTLITIES_CONFIG, useValue: CashflowConfigService },
        {
          provide: CashflowDataService,
          useValue: cashflowService = MockService(CashflowDataService) as Mocked<
            CashflowDataService
          >,
        },
      ],
    }).compileComponents();
    service = TestBed.inject(OriginationProposalService);
  });

  /*
   * Note that this service is tested by the tests for the components that use it.
   * As we do not mock this service when testing those components
   */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLatestDate', () => {
    describe('GIVEN both dates are valid', () => {
      test('THEN return the latest date ', () => {
        const result = service.getLatestDate('2020-10-23', '2020-10-24');
        expect(result).toEqual('2020-10-24');
      });
    });

    describe('GIVEN both dates are invalid', () => {
      test('THEN return an empty string', () => {
        const result = service.getLatestDate('foo', 'bar');
        expect(result).toEqual('');
      });
    });

    describe('GIVEN first date is invalid', () => {
      test('THEN return second date ', () => {
        const result = service.getLatestDate('foo', '2020-10-23');
        expect(result).toEqual('2020-10-23');
      });
    });

    describe('GIVEN second date is invalid', () => {
      test('THEN return first date ', () => {
        const result = service.getLatestDate('2020-10-24', 'bar');
        expect(result).toEqual('2020-10-24');
      });
    });
  });
});
