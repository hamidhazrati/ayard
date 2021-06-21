import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Contract } from '@app/features/contracts/models/contract.model';
import { moduleDeclarations, moduleImports } from '@app/features/contracts/contracts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PricingAttributesFormComponent } from '@app/features/contracts/components/shared/pricing-attributes-form/pricing-attributes-form.component';
import {
  getPricingFields,
  setContractFields,
} from '@app/features/contracts/components/shared/pricing-attributes-form/model/functions';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { verifySelectedOptions } from '@app/shared/utils/test/verify-mat-select-options';
import { getByTestId } from '@app/shared/utils/test';
import { DuplicateChecksComponent } from '@app/features/contracts/components/shared/duplicate-check-fields/duplicate-checks.component';

const DUPLICATE_CHECKS_COMPONENT_TESTID = 'duplicate-checks-component';
const DOCUMENT_TYPES_SELECTOR_TESTID = 'document-types-selector';

describe('PricingAttributesFormComponent', () => {
  let component: PricingAttributesFormComponent;
  let fixture: ComponentFixture<PricingAttributesFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: moduleDeclarations,
      imports: [HttpClientTestingModule, NoopAnimationsModule, ...moduleImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingAttributesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('GIVEN the component is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN the form is readonly', () => {
      beforeEach(() => {
        component.readonly = true;
      });

      test('THEN the form is disabled', () => {
        component.ngOnChanges({
          readonly: {
            currentValue: true,
            previousValue: false,
            isFirstChange: () => true,
            firstChange: false,
          },
        });

        fixture.detectChanges();
        expect(component.form.disabled).toEqual(false);
      });
    });

    test('THEN expect input spread field to have appPositiveTwoDecimal directive', () => {
      expect(
        fixture.nativeElement.querySelector('[data-testid="spread"][appPositiveTwoDecimal]'),
      ).toBeTruthy();
    });

    test('THEN the form defaults are set', () => {
      const controls = component.form.controls;

      expect(controls.calculationType.value).toEqual('STANDARD');
      expect(controls.roundingMode.value).toEqual('HALF_UP');
      expect(controls.referenceRateAdjustmentType.value).toEqual('BUSINESS');
      expect(controls.pricingOperation.value).toEqual('INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE');
      expect(controls.documentTypes.value).toEqual(['INVOICE']);
      expect(controls.exclusions.value).toEqual(['PAST_DUE', 'FUTURE_DATED_RECEIVABLES']);
    });

    describe('WHEN no fields are set by the user', () => {
      test('THEN all fields are valid', () => {
        const controls = component.form.controls;
        expect(controls.discountMode.valid).toBeTruthy();
        expect(controls.roundingMode.valid).toBeTruthy();
        expect(controls.referenceRateAdjustmentType.valid).toBeTruthy();
        expect(controls.referenceRateOffset.valid).toBeTruthy();
        expect(controls.tenorRange.controls.min.valid).toBeTruthy();
        expect(controls.tenorRange.controls.max.valid).toBeTruthy();
        expect(controls.settlementDays.valid).toBeTruthy();
        expect(controls.tradingCutoff.valid).toBeTruthy();
        expect(controls.calculationType.valid).toBeTruthy();
        expect(controls.spread.valid).toBeTruthy();
        expect(controls.pricingOperation.valid).toBeTruthy();
        expect(controls.documentTypes.valid).toBeTruthy();
        expect(controls.advanceRate.valid).toBeTruthy();
        expect(controls.automatedPayment.valid).toBeTruthy();
        expect(controls.bauObligorName.valid).toBeTruthy();
        expect(controls.discountPosting.valid).toBeTruthy();
        expect(controls.leadDays.valid).toBeTruthy();
        expect(controls.rejectionMode.valid).toBeTruthy();
        expect(controls.exclusions.valid).toBeTruthy();
        expect(component.form.valid).toBeTruthy();
      });
    });

    describe('WHEN all fields are set to null or empty', () => {
      beforeEach(() => {
        const controls = component.form.controls;
        controls.roundingMode.setValue(null);
        controls.discountMode.setValue(null);
        controls.referenceRateAdjustmentType.setValue(null);
        controls.referenceRateOffset.setValue(null);
        controls.tenorRange.controls.min.setValue(null);
        controls.tenorRange.controls.max.setValue(null);
        controls.settlementDays.setValue(null);
        controls.tradingCutoff.setValue(null);
        controls.calculationType.setValue(null);
        controls.spread.setValue(null);
        controls.pricingOperation.setValue(null);
        controls.documentTypes.setValue([]);
        controls.advanceRate.setValue(null);
        controls.automatedPayment.setValue(null);
        controls.bauObligorName.setValue(null);
        controls.discountPosting.setValue(null);
        controls.leadDays.setValue(null);
        controls.rejectionMode.setValue(null);
        controls.exclusions.setValue([]);
      });

      test('THEN everything is valid because everything is optional', () => {
        const controls = component.form.controls;
        expect(controls.roundingMode.valid).toBeTruthy();
        expect(controls.discountMode.valid).toBeTruthy();
        expect(controls.referenceRateAdjustmentType.valid).toBeTruthy();
        expect(controls.referenceRateOffset.valid).toBeTruthy();
        expect(controls.tenorRange.controls.min.valid).toBeTruthy();
        expect(controls.tenorRange.controls.max.valid).toBeTruthy();
        expect(controls.settlementDays.valid).toBeTruthy();
        expect(controls.tradingCutoff.valid).toBeTruthy();
        expect(controls.calculationType.valid).toBeTruthy();
        expect(controls.spread.valid).toBeTruthy();
        expect(controls.pricingOperation.valid).toBeTruthy();
        expect(controls.documentTypes.valid).toBeTruthy();
        expect(controls.advanceRate.valid).toBeTruthy();
        expect(controls.automatedPayment.valid).toBeTruthy();
        expect(controls.bauObligorName.valid).toBeTruthy();
        expect(controls.discountPosting.valid).toBeTruthy();
        expect(controls.leadDays.valid).toBeTruthy();
        expect(controls.rejectionMode.valid).toBeTruthy();
        expect(controls.exclusions.valid).toBeTruthy();
        expect(component.form.valid).toBeTruthy();
      });
    });

    describe('WHEN required fields values are set to valid values', () => {
      beforeEach(() => {
        const controls = component.form.controls;
        controls.discountMode.setValue('MANUAL');
        controls.roundingMode.setValue('HALF_UP');
        controls.referenceRateAdjustmentType.setValue('BUSINESS');
        controls.referenceRateOffset.setValue(-2);
        controls.tenorRange.controls.min.setValue(1);
        controls.tenorRange.controls.max.setValue(3);
        controls.settlementDays.setValue(4);
        controls.tradingCutoff.setValue('00:00');
        controls.calculationType.setValue('STANDARD');
        controls.spread.setValue(500);
        controls.pricingOperation.setValue('test');
        controls.documentTypes.setValue(['INVOICE']);
        controls.advanceRate.setValue(100);
        controls.rejectionMode.setValue('NONE');
        controls.exclusions.setValue(['PAST_DUE']);
      });

      test('THEN fields are valid', () => {
        const controls = component.form.controls;
        expect(controls.roundingMode.valid).toBeTruthy();
        expect(controls.discountMode.valid).toBeTruthy();
        expect(controls.referenceRateAdjustmentType.valid).toBeTruthy();
        expect(controls.referenceRateOffset.valid).toBeTruthy();
        expect(controls.tenorRange.controls.min.valid).toBeTruthy();
        expect(controls.tenorRange.controls.max.valid).toBeTruthy();
        expect(controls.settlementDays.valid).toBeTruthy();
        expect(controls.tradingCutoff.valid).toBeTruthy();
        expect(controls.calculationType.valid).toBeTruthy();
        expect(controls.spread.valid).toBeTruthy();
        expect(controls.pricingOperation.valid).toBeTruthy();
        expect(controls.documentTypes.valid).toBeTruthy();
        expect(controls.advanceRate.valid).toBeTruthy();
        expect(controls.rejectionMode.valid).toBeTruthy();
        expect(controls.exclusions.valid).toBeTruthy();
        expect(component.form.valid).toBeTruthy();
      });

      test('THEN fields can be converted to pricing values', () => {
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing).toEqual({
          calculationType: 'STANDARD',
          discountMode: 'MANUAL',
          documentTypes: ['INVOICE'],
          advanceRate: 100,
          automatedPayment: false,
          bauObligorName: null,
          discountPosting: null,
          leadDays: null,
          rejectionMode: 'NONE',
          exclusions: ['PAST_DUE'],
          maxTenor: 3,
          minTenor: 1,
          pricingOperation: {
            interpolated: false,
            spread: 500,
            type: 'test',
          },
          referenceRateAdjustmentType: 'BUSINESS',
          referenceRateOffset: -2,
          roundingMode: 'HALF_UP',
          settlementDays: 4,
          tradingCutoff: '00:00',
          hashExpressions: null,
        });
      });

      test('THEN pricingOperation converted correctly for INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE', () => {
        component.form.controls.pricingOperation.setValue(
          'INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE',
        );
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing.pricingOperation).toEqual({
          interpolated: true,
          spread: 500,
          type: 'SPREAD_PLUS_REFERENCE_RATE',
        });
      });

      test('THEN pricingOperation converted correctly for BANDED_SPREAD_PLUS_REFERENCE_RATE', () => {
        component.form.controls.pricingOperation.setValue('BANDED_SPREAD_PLUS_REFERENCE_RATE');
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing.pricingOperation).toEqual({
          interpolated: false,
          spread: 500,
          type: 'SPREAD_PLUS_REFERENCE_RATE',
        });
      });

      test('THEN pricingOperation converted correctly for FLAT_RATE', () => {
        component.form.controls.pricingOperation.setValue('FLAT_RATE');
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing.pricingOperation).toEqual({
          interpolated: false,
          spread: 500,
          type: 'FLAT_RATE',
        });
      });

      test('THEN pricingOperation converted correctly for ALL_IN_RATE', () => {
        component.form.controls.pricingOperation.setValue('ALL_IN_RATE');
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing.pricingOperation).toEqual({
          interpolated: false,
          spread: 500,
          type: 'ALL_IN_RATE',
        });
      });
      test('THEN pricingOperation converted correctly for PARTNER_CALCULATED_DISCOUNT', () => {
        component.form.controls.pricingOperation.setValue('PARTNER_CALCULATED_DISCOUNT');
        // @ts-ignore
        const contractPricing = setContractFields(component.form.value);
        expect(contractPricing.pricingOperation).toEqual({
          interpolated: true,
          spread: 500,
          type: 'PARTNER_CALCULATED_DISCOUNT',
        });
      });
    });

    describe('WHEN getPricingFields is queried', () => {
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

      test('THEN everything is mapped correctly to pricingFields', () => {
        const pricingFields = getPricingFields(contract);

        expect(pricingFields).toEqual({
          referenceRateAdjustmentType: 'BUSINESS',
          referenceRateOffset: 5,
          roundingMode: 'HALF_UP',
          settlementDays: 4,
          tenorRange: {
            min: 1,
            max: 9,
          },
          tradingCutoff: 'tradingCutoff',
          calculationType: 'STANDARD',
          documentTypes: ['INVOICE'],
          spread: 500,
          pricingOperation: 'INTERPOLATED_SPREAD_PLUS_REFERENCE_RATE',
          exclusions: ['FUTURE_DATED_RECEIVABLES'],
          discountMode: 'AUTO',
          advanceRate: 23,
          automatedPayment: true,
          bauObligorName: 'bauObligorName',
          discountPosting: 'discountPosting',
          leadDays: 2,
          rejectionMode: 'NONE',
          hashExpressions: [],
        });
      });

      test('THEN pricingOperation is mapped correctly for BANDED_SPREAD_PLUS_REFERENCE_RATE', () => {
        contract.pricingOperation.interpolated = false;

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual('BANDED_SPREAD_PLUS_REFERENCE_RATE');
      });

      test('THEN pricingOperation is mapped correctly for FLAT_RATE', () => {
        contract.pricingOperation.type = 'FLAT_RATE';

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual('FLAT_RATE');
      });

      test('THEN pricingOperation is mapped correctly for ALL_IN_RATE', () => {
        contract.pricingOperation.type = 'ALL_IN_RATE';

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual('ALL_IN_RATE');
      });

      test('THEN pricingOperation is mapped correctly for PARTNER_CALCULATED_DISCOUNT', () => {
        contract.pricingOperation.type = 'PARTNER_CALCULATED_DISCOUNT';

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual('PARTNER_CALCULATED_DISCOUNT');
      });

      test('THEN pricingOperation is mapped correctly for null type', () => {
        contract.pricingOperation.type = null;

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual(null);
      });

      test('THEN pricingOperation is mapped correctly for null object', () => {
        contract.pricingOperation = null;

        const pricingFields = getPricingFields(contract);

        expect(pricingFields.pricingOperation).toEqual(null);
      });
    });

    describe(`WHEN the ${DOCUMENT_TYPES_SELECTOR_TESTID} is loaded`, () => {
      let documentTypesSelector: MatSelectHarness;

      beforeEach(async () => {
        documentTypesSelector = await loader.getHarness<MatSelectHarness>(
          MatSelectHarness.with({
            selector: `[data-testid="${DOCUMENT_TYPES_SELECTOR_TESTID}"]`,
          }),
        );
        expect(documentTypesSelector).toBeTruthy();
      });

      test('THEN only the "INVOICE" Document Type is selected by default', async () => {
        await verifySelectedOptions(documentTypesSelector, ['Invoice']);
      });

      test(`THEN ${DUPLICATE_CHECKS_COMPONENT_TESTID} is visible`, async () => {
        expect(getByTestId(fixture, DUPLICATE_CHECKS_COMPONENT_TESTID)).toBeTruthy();
      });

      describe(`WHEN ${DUPLICATE_CHECKS_COMPONENT_TESTID} is visible`, () => {
        let duplicateChecksComponent: DuplicateChecksComponent = null;
        beforeEach(async () => {
          const duplicateChecksComponentDE = getByTestId(
            fixture,
            DUPLICATE_CHECKS_COMPONENT_TESTID,
          );
          duplicateChecksComponent = duplicateChecksComponentDE.componentInstance as DuplicateChecksComponent;
          jest.spyOn(duplicateChecksComponent, 'clearSelectionState');
        });

        describe(`WHEN I unselect all Document Types options`, () => {
          beforeEach(async () => {
            await documentTypesSelector.clickOptions({
              text: 'Invoice', // unclick Invoice
            });
            await verifySelectedOptions(documentTypesSelector, []);
          });

          test(`THEN clearSelectionState on ${DUPLICATE_CHECKS_COMPONENT_TESTID} has been called`, async () => {
            expect(duplicateChecksComponent.clearSelectionState).toHaveBeenCalled();
          });
        });
      });

      describe(`WHEN no options are selected in ${DOCUMENT_TYPES_SELECTOR_TESTID}`, () => {
        beforeEach(async () => {
          await documentTypesSelector.clickOptions({
            text: 'Invoice', // unclick Invoice
          });
          await verifySelectedOptions(documentTypesSelector, []);
        });

        test(`THEN duplicate ${DUPLICATE_CHECKS_COMPONENT_TESTID} is not visible`, async () => {
          expect(getByTestId(fixture, DUPLICATE_CHECKS_COMPONENT_TESTID)).toBeFalsy();
        });
      });

      describe(`WHEN only the "Credit Note" option is selected in ${DOCUMENT_TYPES_SELECTOR_TESTID}`, () => {
        beforeEach(async () => {
          await documentTypesSelector.clickOptions({
            text: /Credit Note|Invoice/, // unclick Invoice and click Credit Note
          });
          await verifySelectedOptions(documentTypesSelector, ['Credit Note']);
        });

        test(`THEN ${DUPLICATE_CHECKS_COMPONENT_TESTID} is not visible`, async () => {
          expect(getByTestId(fixture, DUPLICATE_CHECKS_COMPONENT_TESTID)).toBeFalsy();
        });
      });

      describe(`WHEN both the "Invoice" and the "Credit Note" options are selected in ${DOCUMENT_TYPES_SELECTOR_TESTID}`, () => {
        beforeEach(async () => {
          await documentTypesSelector.clickOptions({
            text: 'Credit Note', // click Credit Note, Invoice is already selected
          });
          await verifySelectedOptions(documentTypesSelector, ['Credit Note', 'Invoice']);
        });

        test(`THEN ${DUPLICATE_CHECKS_COMPONENT_TESTID} is visible`, async () => {
          expect(getByTestId(fixture, DUPLICATE_CHECKS_COMPONENT_TESTID)).toBeTruthy();
        });
      });
    });
  });
});
