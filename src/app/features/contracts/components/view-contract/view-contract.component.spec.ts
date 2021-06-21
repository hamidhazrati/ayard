import { CrumbService } from '../../../../services/crumb/crumb.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MockService } from 'ng-mocks';
import { getByTestId } from '../../../../shared/utils/test';
import { ViewContractComponent } from './view-contract.component';
import { ContractService } from '../../services/contract.service';
import { viewContractCrumb } from './view-contract.crumb';
import { Contract } from '../../models/contract.model';
import { Product } from '../../../products/models/product.model';
import { ProductService } from '../../../products/services/product.service';
import { moduleDeclarations, moduleImports } from '../../contracts.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ResolutionType } from '../../../products/models/rule.model';
import { PricingAttributesFormComponent } from '@app/features/contracts/components/shared/pricing-attributes-form/pricing-attributes-form.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectionListHarness } from '@angular/material/list/testing';

const ID = '123';
const PRICING_ATTRIBUTES_FORM_COMPONENT_TESTID = 'pricing-attributes-form';

const sampleProduct: Product = {
  id: 'BP_99',
  status: null,
  productCategoryId: null,
  name: null,
  description: null,
  productGuideLink: null,
  counterpartyRoles: [
    {
      name: 'BUYER',
      description: null,
      required: false,
      type: 'PRIMARY',
    },
    {
      name: 'SELLER',
      description: null,
      required: false,
      type: 'RELATED',
    },
  ],
  rules: [],
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
  referenceRateOffset: 5,
  referenceRateAdjustmentType: 'BUSINESS',
  roundingMode: 'HALF_UP',
  settlementDays: 4,
  minTenor: 1,
  maxTenor: 9,
  tradingCutoff: 'tradingCutoff',
  calculationType: 'STANDARD',
  pricingOperation: {
    type: 'SPREAD_PLUS_REFERENCE_RATE',
    interpolated: true,
    spread: 500,
  },
  documentTypes: ['INVOICE'],
  exclusions: ['FUTURE_DATED_RECEIVABLES'],
  discountMode: 'AUTO',
  advanceRate: 23,
  automatedPayment: true,
  bauObligorName: 'bauObligorName',
  discountPosting: 'discountPosting',
  leadDays: 2,
  rejectionMode: 'NONE',
};
const expectedHashExpressions: string[] = [
  'cashflow.documentReference',
  'cashflow.currency',
  `counterparties.?[role == '${sampleProduct.counterpartyRoles[0].name}'][0].entityId`,
  `counterparties.?[role == '${sampleProduct.counterpartyRoles[1].name}'][0].entityId`,
];
const sampleContract: Contract = {
  productName: '',
  productCategoryName: '',
  productCategoryId: '',
  id: 'abc123',
  name: 'Sample Contract',
  status: 'INACTIVE',
  channelReference: 'Channel Six',
  partnerId: 'Partners ID',
  productId: 'BP_99',
  product: 'Base Product',
  created: '2020-06-18',
  rules: [
    {
      name: 'Rule 1',
      resolutionType: ResolutionType.INTERNAL,
      resource: 'PRICING',
      expression: 'expr1',
      code: 'CDE1',
      message: 'MSG1',
      matchExpression: null,
      outcomeType: 'RESOLVABLE',
      outcomeDescription: null,
    },
    {
      name: 'Rule 2',
      resolutionType: ResolutionType.INTERNAL,
      resource: 'PRICING',
      expression: 'expr2',
      code: 'CDE2',
      message: 'MSG2',
      matchExpression: null,
      outcomeType: 'TERMINAL',
      outcomeDescription: 'description of terminal',
    },
  ],
  currencies: null,
  bypassTradeAcceptance: false,
  hashExpressions: expectedHashExpressions,
};

describe('ViewContractComponent', () => {
  let component: ViewContractComponent;
  let aContract: Contract;
  let crumbService;
  let contractService;
  let productService;
  let fixture: ComponentFixture<ViewContractComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    crumbService = new CrumbService();
    productService = MockService(ProductService);
    productService.getProductById.mockReturnValue(of(sampleProduct));
    contractService = MockService(ContractService);
    aContract = contractService.getContractById.mockReturnValue(of(sampleContract));
    contractService.getContractCounterpartiesById.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      declarations: moduleDeclarations,
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        ...moduleImports,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ID }) } },
        },
        { provide: ContractService, useValue: contractService },
        { provide: ProductService, useValue: productService },
        { provide: CrumbService, useValue: crumbService = MockService(CrumbService) },
        HttpClientTestingModule,
      ],
    });

    fixture = TestBed.createComponent(ViewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('GIVEN ViewContractComponent is initialised', () => {
    describe('GIVEN an contract', () => {
      test('THEN the crumbservice should be called', () => {
        expect(crumbService.setCrumbs).toHaveBeenCalledWith(viewContractCrumb(sampleContract));
      });

      test('THEN the component should be set', () => {
        expect(component.contract).toEqual(sampleContract);
      });

      test('THEN it should initialize with the contract', () => {
        expectMatch('contract-id', 'abc123');
        expectMatch('contract-edit', '');
        expectMatch('contract-name', 'Sample Contract');
        expectMatch('contract-product', 'Base Product');
        expectMatch('contract-created', '18 Jun 2020');
        expectMatch('contract-status', 'Inactive');
        expectMatch('partner-id', 'Partners ID');
      });

      test('THEN WHEN I select Parameters PricintAttributesFormComponent gets loaded', async () => {
        const contractDetailsSelector = await loader.getHarness<MatSelectionListHarness>(
          MatSelectionListHarness.with({
            selector: `[data-testid="contract-details-selector"]`,
          }),
        );
        expect(contractDetailsSelector).toBeTruthy();
        const matListOptionHarness = await contractDetailsSelector.getItems();
        const text1 = await matListOptionHarness[0].getText();
        const text2 = await matListOptionHarness[1].getText();
        await contractDetailsSelector.selectItems({
          text: 'Parameters',
        });
        fixture.detectChanges();

        const pricingAttributesFormDE = getByTestId(
          fixture,
          PRICING_ATTRIBUTES_FORM_COMPONENT_TESTID,
        );
        const pricingAttributesForm = pricingAttributesFormDE.componentInstance as PricingAttributesFormComponent;
        expect(pricingAttributesForm.counterpartyRoles).toEqual(
          sampleProduct.counterpartyRoles.map((rt) => rt.name),
        );
      });

      test('THEN it should be able to UPDATE parameter for PENDING_APPROVAL contract', () => {
        contract.status = 'PENDING_APPROVAL';
        component.editing = true;
        expect(component.canSubmitEdit()).toEqual(true);
      });
      test('THEN it should be able to UPDATE parameter for APPROVED contract', () => {
        contract.status = 'APPROVED';
        component.editing = true;
        expect(component.canSubmitEdit()).toEqual(true);
      });
      test('THEN it should be able to UPDATE parameter for ACTIVE contract', () => {
        contract.status = 'ACTIVE';
        component.editing = true;
        expect(component.canSubmitEdit()).toEqual(true);
      });
      test('THEN it should not be able to UPDATE parameter for ACTIVE contract', () => {
        contract.status = 'ACTIVE';
        component.editing = false;
        expect(component.canSubmitEdit()).toEqual(false);
      });
      test('THEN it should not be able to UPDATE parameter for ACTIVE contract when not editing', () => {
        contract.status = 'ACTIVE';
        component.editing = false;
        expect(component.canSubmitEdit()).toEqual(false);
      });
      test('THEN it should not be able to UPDATE parameter for APPROVED contract when not editing', () => {
        contract.status = 'APPROVED';
        component.editing = false;
        expect(component.canSubmitEdit()).toEqual(false);
      });
      test('THEN it should not be able to UPDATE parameter for APPROVED contract when invalid form', () => {
        contract.status = 'APPROVED';
        component.editing = true;
        component.form = null;
        expect(component.canSubmitEdit()).toEqual(false);
      });
      test('THEN it should not be able to UPDATE parameter for ACTIVE contract when invalid form', () => {
        contract.status = 'ACTIVE';
        component.editing = true;
        component.form = null;
        expect(component.canSubmitEdit()).toEqual(false);
      });

      test('THEN PENDING contracts should be editable', () => {
        component.contract.status = 'PENDING_APPROVAL';
        fixture.detectChanges();
        expectMatch('contract-edit', 'Edit');
      });
      test('THEN ACTIVE contracts should be not editable', () => {
        component.contract.status = 'ACTIVE';
        fixture.detectChanges();
        expectMatch('contract-edit', '');
      });
      test('THEN APPROVED contracts should be not editable', () => {
        component.contract.status = 'APPROVED';
        fixture.detectChanges();
        expectMatch('contract-edit', '');
      });
    });
  });

  function expectMatch(elementTestId: string, expectedValue: string) {
    const debugElement = getByTestId(fixture, elementTestId, true);
    const value = debugElement.nativeElement.textContent.trim();
    expect(value).toEqual(expectedValue);
  }
});
