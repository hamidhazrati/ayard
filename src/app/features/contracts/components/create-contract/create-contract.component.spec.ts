import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { CHANNEL_REFERENCE, CreateContractComponent } from './create-contract.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { EntityService } from '@app/features/entities/services/entity.service';
import {
  ContractCounterPartiesService,
  CreateContractRequest,
} from '@app/features/contracts/services/contract-counterparties.service';
import { Product } from '@app/features/products/models/product.model';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { getArrayWithDistinctValues } from '@app/shared/utils';
import {
  assertMaterialDropdownContents,
  selectFirstOption,
  triggerClick,
} from '@app/shared/utils/test';
import {
  products,
  productCategories,
} from '@app/features/contracts/components/create-contract/products.test-data';
import { MockService } from 'ng-mocks';
import { createContractCrumb } from '@app/features/contracts/components/create-contract/create-contract.crumb';

import Mocked = jest.Mocked;
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { Entity } from '@entities/models/entity.model';
import { SideBarDialogService } from '@app/shared/components/side-bar-dialog/side-bar-dialog.service';
import { moduleImports, moduleDeclarations } from '../../contracts.module';
import { MIN_ENTITY_LOOKUP_LENGTH } from '@app/features/entities/components/entity-selector/entity-selector.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

const ENTITIES = [
  {
    id: '1',
    name: 'Liberty Steel',
  },
  {
    id: '2',
    name: 'Disney',
  },
] as Entity[];

describe('CreateContractComponent', () => {
  let component: CreateContractComponent;
  let fixture: ComponentFixture<CreateContractComponent>;
  let loader: HarnessLoader;
  let router: Router;
  const mockCrumbService: Mocked<CrumbService> = MockService(CrumbService) as Mocked<CrumbService>;
  const mockProductCategoryService: Mocked<ProductCategoryService> = MockService(
    ProductCategoryService,
  ) as Mocked<ProductCategoryService>;
  const mockEntityService: Mocked<EntityService> = MockService(EntityService) as Mocked<
    EntityService
  >;
  const mockContractCounterPartiesService: Mocked<ContractCounterPartiesService> = MockService(
    ContractCounterPartiesService,
  ) as Mocked<ContractCounterPartiesService>;

  mockProductCategoryService.getCategories.mockImplementation(() => {
    return of(productCategories);
  });

  mockContractCounterPartiesService.save.mockImplementation(() => {
    return of('123');
  });

  mockEntityService.getEntities.mockImplementation(() => {
    return of(ENTITIES);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [...moduleDeclarations],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        ...moduleImports,
      ],
      providers: [
        { provide: CrumbService, useValue: mockCrumbService },
        { provide: EntityService, useValue: mockEntityService },
        { provide: ContractCounterPartiesService, useValue: mockContractCounterPartiesService },
        { provide: ProductCategoryService, useValue: mockProductCategoryService },
        { provide: SideBarDialogService, useValue: MockService(SideBarDialogService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContractComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  describe('GIVEN the page is loaded', () => {
    test('THEN the component is created', () => {
      expect(component).toBeTruthy();
    });

    test('THEN breadcrumbs should be set', () => {
      expect(mockCrumbService.setCrumbs).toHaveBeenCalledWith(createContractCrumb());
    });

    test('THEN the product categories are loaded in the drop-down', async () => {
      await assertMaterialDropdownContents(
        fixture,
        By.css('[data-testid="category"]'),
        getArrayWithDistinctValues(productCategories.map((c: ProductCategory) => c.name)),
      );
    });

    describe('WHEN the user selects a category', () => {
      test('THEN the products are loaded in the drop-down', async () => {
        selectCategory(0);

        await assertMaterialDropdownContents(
          fixture,
          By.css('[data-testid="product"]'),
          getArrayWithDistinctValues(
            productCategories[0].products
              .map((p: Product) => p.name) // fetch all products for scf
              .filter((name: string) => name), // ignore null/undefined
          ),
        );
      });

      describe('WHEN the user selects a product', () => {
        const categorySelected = 0;
        const productSelected = 1;

        beforeEach(() => {
          selectCategory(categorySelected);
          selectProduct(productSelected);
          fixture.detectChanges();
        });

        test('THEN the contract fields should be displayed', async () => {
          expect(getDebugElementByTestId('contract-name-input')).toBeTruthy();
          expect(getDebugElementByTestId('contract-status-select')).toBeTruthy();
        });

        test('THEN the roles should be displayed', async () => {
          assertRoleLabel(
            0,
            `${productCategories[categorySelected].products[productSelected].counterpartyRoles[0].name}`,
          );
          assertRoleLabel(
            1,
            `${productCategories[categorySelected].products[productSelected].counterpartyRoles[1].name}`,
          );
        });

        describe('WHEN the user does not enter enough text for the entity lookup', () => {
          test('THEN no matching entities should be displayed', async () => {
            const entitySearch = randomString(MIN_ENTITY_LOOKUP_LENGTH - 1);
            const elems: DebugElement[] = await whenUserEntersEntityDetails(entitySearch, 0, 0);
            expect(elems.length).toEqual(0);
          });
        });

        describe('WHEN the user does enter enough text for the entity lookup', () => {
          test('THEN the matching entities should be displayed', async () => {
            const entitySearch = randomString(MIN_ENTITY_LOOKUP_LENGTH);
            const elems: DebugElement[] = await whenUserEntersEntityDetails(entitySearch, 0, 0);
            expect(elems.length).toBe(2);
            expect(elems[0].nativeElement.textContent).toContain(ENTITIES[0].name);
            expect(elems[1].nativeElement.textContent).toContain(ENTITIES[1].name);
          });
        });

        describe('WHEN the user selects entities for the roles and enters field data', () => {
          beforeEach(async () => {
            let elems: DebugElement[] = await whenUserEntersEntityDetails('abc', 0, 0);
            triggerClick(fixture, elems[0]);

            elems = await whenUserEntersEntityDetails('abc', 1, 0);
            triggerClick(fixture, elems[0]);

            setInputTestElement('contract-name-input', 'A CONTRACT NAME');
            selectFirstOption(fixture, 'contract-status-select');
            whenUserEntersSomePricingParameters();
            fixture.detectChanges();
          });

          function whenUserEntersSomePricingParameters() {
            selectFirstOption(fixture, 'discount-mode');
            setInputTestElement('min-tenor', '1');
            setInputTestElement('max-tenor', '2');
            setInputTestElement('spread', '3');
            setInputTestElement('settlement-days', '3');
            selectFirstOption(fixture, 'trading-cut-off');
            setInputTestElement('settlement-days', '3');
            setInputTestElement('advance-rate', '85');
            setInputTestElement('bau-obligor-name', 'Billy Bob');
            setInputTestElement('discount-posting', 'NETTING');
            setInputTestElement('lead-days', '5');
          }

          describe('WHEN the user clicks save', () => {
            beforeEach(() => {
              const navSpy = jest
                .spyOn(router, 'navigate')
                .mockImplementation(() => of(true).toPromise());
              saveIsClicked();
            });

            test('THEN the contract is saved', async () => {
              expect(component.form.valid).toBeTruthy();
              expect(mockContractCounterPartiesService.save).toHaveBeenCalled();

              const product = products[1];

              const request: CreateContractRequest = {
                productCategoryName: 'AR',
                productCategoryId: 'AR_ID',
                productName: 'AR sub',
                name: 'A CONTRACT NAME',
                status: 'PENDING_APPROVAL',
                product: `${productCategories[categorySelected].name} ${productCategories[categorySelected].products[productSelected].name}`,
                channelReference: CHANNEL_REFERENCE,
                partnerId: null,
                productId: '1',
                counterparties: [
                  {
                    entity: ENTITIES[0],
                    productCounterpartyRole: product.counterpartyRoles[0],
                    reference: null,
                  },
                ],
                pricingOperation: {
                  interpolated: true,
                  spread: 3,
                  type: 'SPREAD_PLUS_REFERENCE_RATE',
                },
                calculationType: 'STANDARD',
                referenceRateAdjustmentType: 'BUSINESS',
                referenceRateOffset: -1,
                roundingMode: 'HALF_UP',
                documentTypes: ['INVOICE'],
                exclusions: ['PAST_DUE', 'FUTURE_DATED_RECEIVABLES'],
                settlementDays: 3,
                tradingCutoff: '00:00',
                maxTenor: 2,
                minTenor: 1,
                rules: [],
                currencies: {},
                discountMode: 'MANUAL',
                bypassTradeAcceptance: false,
                advanceRate: 85,
                automatedPayment: false,
                bauObligorName: 'Billy Bob',
                discountPosting: 'NETTING',
                leadDays: 5,
                rejectionMode: 'NONE',
                hashExpressions: null,
              };

              expect(mockContractCounterPartiesService.save).toHaveBeenCalledWith(request);

              expect(router.navigate).toHaveBeenCalledWith(['/contracts/123']);
            });
          });

          describe('WHEN name of an existing Contract is used', () => {
            beforeEach(async () => {
              mockContractCounterPartiesService.save.mockReturnValue(
                throwError({
                  status: 409,
                  error: { details: [{ target: `{ \"name\": \"contract 1\" }` }] },
                }),
              );

              const navSpy = jest
                .spyOn(router, 'navigate')
                .mockImplementation(() => of(true).toPromise());
            });

            test('THEN show error message for duplicate contract name', fakeAsync(() => {
              saveIsClicked();

              expect(fixture.componentInstance.serverError).toBe(
                'Duplicate Contract name contract 1 is not allowed.',
              );

              const serverError = getDebugElementByTestId('server-error');
              expect(serverError.nativeElement.textContent).toBe(
                'Duplicate Contract name contract 1 is not allowed.',
              );
            }));
          });
        });
      });
    });
  });

  function getDebugElementByTestId(testId: string): DebugElement {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  async function setInputTestElement(id: string, data: string) {
    const inputElement = getDebugElementByTestId(id).nativeElement;
    inputElement.value = data;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function setSelectOption(id: string) {
    const select = getDebugElementByTestId(id);
    select.nativeElement.click();
    fixture.detectChanges();
    const selectOptions = fixture.debugElement.queryAll(By.css(`.${id}-option`));
    selectOptions[0].nativeElement.click();
    fixture.detectChanges();
  }

  function saveIsClicked() {
    const saveButton = fixture.debugElement.query(By.css('[data-testid="save"]'));
    triggerClick(fixture, saveButton);
  }

  function addRuleIsClicked() {
    const addRuleButton = fixture.debugElement.query(By.css('[data-testid="add-rule-button"]'));
    triggerClick(fixture, addRuleButton);
  }

  function selectCategory(index: number) {
    const dropdownElement = fixture.debugElement.query(By.css('[data-testid="category"]'));
    triggerClick(fixture, dropdownElement); // click on product Category dropdown
    const optionElements: DebugElement[] = dropdownElement.queryAll(By.css('mat-option'));
    triggerClick(fixture, optionElements[index]); // select 'scf'
  }

  function selectProduct(index: number) {
    const dropdownElement = fixture.debugElement.query(By.css('[data-testid="product"]'));
    triggerClick(fixture, dropdownElement);
    const optionElements: DebugElement[] = dropdownElement.queryAll(By.css('mat-option'));
    triggerClick(fixture, optionElements[index]);
  }

  function assertRoleLabel(roleIndex: number, expectedLabel: string) {
    const entityLabel = fixture.debugElement.query(
      By.css(`[data-testid="counterparty-role-${roleIndex}"] [data-testid="role-name"]`),
    );
    expect(entityLabel.nativeElement.textContent).toContain(expectedLabel);
  }

  async function whenUserEntersEntityDetails(
    entitySearch: string,
    roleIndex: number,
    entityIndex: number,
  ): Promise<DebugElement[]> {
    const entityInput = fixture.debugElement.query(
      By.css(
        `[data-testid="counterparty-role-${roleIndex}"]
        [data-testid="counterparty-entity-control-selector-${entityIndex}"]
        [data-testid="entity-selector-input"]`,
      ),
    ).nativeElement;
    entityInput.dispatchEvent(new Event('focusin'));
    entityInput.value = entitySearch;
    entityInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    entityInput.dispatchEvent(new Event('keydown'));
    fixture.detectChanges();
    await fixture.whenStable();
    entityInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.debugElement.queryAll(By.css('[data-testid="entity-selector-option"]'));
  }

  function randomString(length: number): string {
    return 'A'.repeat(length);
  }
});
