import {
  async,
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ViewRuleComponent } from './view-rule.component';
import { getByTestId } from '@app/shared/utils/test';
import { ResolutionType, Rule } from '../../models/rule.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Contract } from '@app/features/contracts/models/contract.model';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { of, throwError } from 'rxjs';

describe('ViewRuleComponent', () => {
  let component: ViewRuleComponent;
  let fixture: ComponentFixture<ViewRuleComponent>;
  let contractService: ContractService;
  const rule: Rule = {
    resolutionType: ResolutionType.INTERNAL,
    name: 'Max Sellers',
    resource: 'seller',
    expression: 'cashflow.seller.count > 100',
    message: 'The maximum numeber of sellers on this contract has been reached',
    code: 'MAX_SELLER_BREACHED',
    matchExpression: null,
    outcomeType: 'RESOLVABLE',
    outcomeDescription: 'description of resolvable',
  };
  const contract: Contract = {
    productName: '',
    productCategoryName: '',
    productCategoryId: '',
    name: 'Brian',
    status: 'PENDING_APPROVAL',
    productId: null,
    product: null,
    partnerId: '123',
    created: null,
    channelReference: null,
    rules: [],
    id: null,
    currencies: null,
    bypassTradeAcceptance: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRuleComponent],
      imports: [HttpClientTestingModule, SharedModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRuleComponent);
    component = fixture.componentInstance;
    component.rule = rule;
    component.contract = contract;
    contractService = TestBed.inject(ContractService);
    fixture.detectChanges();
  });

  describe('GIVEN the component', () => {
    it('THEN it should create', () => {
      expect(component).toBeTruthy();
    });
    describe('GIVEN a rule', () => {
      it('THEN the fields should be set', () => {
        expectMatch('rule-expression', rule.expression);
        expectMatch('rule-message', rule.message);
        expectMatch('rule-code', rule.code);
        expectMatch('rule-outcome', rule.outcomeType);
        expectMatch('rule-outcomeDescription', rule.outcomeDescription);
      });
    });
  });

  describe('GIVEN the status is PENDING_APPROVAL and has contracts.partnerId', () => {
    it('THEN it should isContractRuleEditable==true', () => {
      expect(component.isContractRuleEditable).toBe(true);
    });
  });
  describe('GIVEN the status is PENDING_APPROVAL and has NULL contracts.partnerId', () => {
    it('THEN it should isContractRuleEditable==false', () => {
      contract.partnerId = null;

      fixture = TestBed.createComponent(ViewRuleComponent);
      component = fixture.componentInstance;
      component.rule = rule;
      component.contract = contract;
      fixture.detectChanges();

      expect(component.isContractRuleEditable).toBe(false);
    });
  });
  describe('GIVEN the status is NOT PENDING_APPROVAL and has  contracts.partnerId', () => {
    it('THEN it should isContractRuleEditable==false', () => {
      contract.partnerId = '123';
      contract.status = 'ACTIVE';

      fixture = TestBed.createComponent(ViewRuleComponent);
      component = fixture.componentInstance;
      component.rule = rule;
      component.contract = contract;
      fixture.detectChanges();

      expect(component.isContractRuleEditable).toBe(false);
    });
  });

  describe('GIVEN cancelRuleChanges is called', () => {
    it('THEN editable and form status is reset', () => {
      component.isContractRuleEditable = true;
      component.bkpResolutionType = ResolutionType.EXTERNAL;
      component.rule.resolutionType = ResolutionType.INTERNAL;
      component.cancelRuleChanges();
      expect(component.isEditingRules).toBe(false);
      expect(component.rule.resolutionType).toBe(ResolutionType.EXTERNAL);
    });
  });

  function expectMatch(selector: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, selector);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }

  it('should update the rule accordingly', () => {
    jest.spyOn(contractService, 'updateContractRuleException').mockReturnValue(of({}));

    component.updateRule();
    expect(contractService.updateContractRuleException).toHaveBeenCalledWith(
      component.contract,
      component.rule,
    );
    expect(component.isEditingRules).toBe(false);
    expect(component.bkpResolutionType).toBe(component.rule.resolutionType);
  });

  it('should handle error upon failed attempt to updateRule', () => {
    jest.spyOn(contractService, 'updateContractRuleException').mockReturnValue(throwError({}));

    component.updateRule();
    expect(contractService.updateContractRuleException).toHaveBeenCalledWith(
      component.contract,
      component.rule,
    );
    expect(component.updateError).toEqual('Update Error: See Logs.');
  });
});
