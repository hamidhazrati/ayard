import { Product } from '@app/features/products/models/product.model';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { Entity } from '@entities/models/entity.model';
import { makeMultipleDropdownSelections } from './util/dropdown-utils';

describe('Create contract', () => {
  const products: Product[] = [
    {
      id: '123',
      productCategoryId: 'PCAT A',
      name: 'Product A',
      productGuideLink: null,
      status: 'ACTIVE',
      description: 'Product A Desc',
      counterpartyRoles: [
        {
          required: true,
          name: 'SELLER',
          description: 'A seller',
          type: 'PRIMARY',
        },
        {
          required: false,
          name: 'BUYER',
          description: 'A buyer',
          type: 'PRIMARY',
        },
      ],
      rules: [],
    },
    {
      id: '123',
      productCategoryId: 'PCAT A',
      name: 'Product B',
      productGuideLink: null,
      status: 'ACTIVE',
      description: 'Product B Desc',
      counterpartyRoles: [],
      rules: [],
    },
  ];

  const productCategories: ProductCategory[] = [
    {
      id: 'PCAT A',
      status: 'ACTIVE',
      name: 'Product Category A',
      description: 'Product Category A Desc',
      productGuideLink: null,
      productType: 'AR',
      products,
    },
  ];

  const entities = [
    {
      id: '1',
      name: 'Apple',
    },
    {
      id: '2',
      name: 'Appliances Online',
    },
  ] as Entity[];

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/product-category?includeProducts=true', productCategories).as(
      'productCategory',
    );
    cy.route('GET', '/entity?name=[*]appl', entities);
    const contractResponse = { id: '123' };
    cy.route('POST', '/contract', contractResponse).as('contractCheck');
    const counterPartyResponse = { id: '444' };
    cy.route('POST', '/contract-counterparty', counterPartyResponse).as('counterpartyCheck');
  });

  describe('GIVEN I visit the new contract page', () => {
    describe('WHEN the save button is clicked', () => {
      describe("WHEN all fields are empty except for 'Product Category', 'Product Name', 'Name' and 'Status'", () => {
        it('THEN it should create a contract', () => {
          cy.kcFakeLogin('user', 'contracts/new');
          cy.wait('@productCategory').then(() => {
            // Then the crumbs are correct
            cy.get('[data-testid="breadcrumbs"]').contains('Create new contract');

            // // And the product category is selected
            cy.selectDropdown('category', 'Product Category A');

            // should not display counter parties
            cy.get('[data-testid="counterparty-roles"]').should('not.exist');

            // // And the product name is selected
            cy.selectDropdown('product', 'Product A');

            // should display fields
            cy.get('[data-testid="contract-name-input"]').should('exist');

            // User enters contract field data
            cy.get('[data-testid="contract-name-input"]').type('A name');

            // should display counter parties
            cy.get('[data-testid="counterparty-roles"]').should('exist');

            // A seller counterparty is present
            cy.get('[data-testid="counterparty-role-0"]').contains(
              products[0].counterpartyRoles[0].name,
            );

            // And the save button is clicked
            cy.get('[data-testid="save"]').click();

            // The new contract page should be shown
            cy.url().should('include', '/contracts/123');

            // Then the correct contract request is made to the server
            cy.wait('@contractCheck').then((xhr) => {
              const expectedRequest = {
                productCategoryId: 'PCAT A',
                productCategoryName: 'AR',
                productName: 'Product A',
                name: 'A name',
                status: 'PENDING_APPROVAL',
                product: 'Product Category A Product A',
                productId: '123',
                partnerId: null,
                channelReference: 'N/A',
                rules: [],
                currencies: {},
                pricingOperation: {
                  interpolated: true,
                  spread: null,
                  type: 'SPREAD_PLUS_REFERENCE_RATE',
                },
                calculationType: 'STANDARD',
                referenceRateAdjustmentType: 'BUSINESS',
                referenceRateOffset: -1,
                roundingMode: 'HALF_UP',
                documentTypes: ['INVOICE'],
                exclusions: ['PAST_DUE', 'FUTURE_DATED_RECEIVABLES'],
                settlementDays: null,
                bypassTradeAcceptance: false,
                tradingCutoff: null,
                maxTenor: null,
                minTenor: null,
                discountMode: null,
                advanceRate: 100,
                automatedPayment: false,
                bauObligorName: null,
                discountPosting: null,
                leadDays: null,
                rejectionMode: 'NONE',
                hashExpressions: null,
              };
              console.log('EXPECTED @@@@@@@@@@@@@@@@');
              console.log(expectedRequest);
              console.log('ACTUAL @@@@@@@@@@@@@@@@');
              console.log(xhr.request.body);
              expect(xhr.request.body).to.eql(expectedRequest);
            });
          });
        });
        describe('WHEN the details are valid and basic', () => {
          it('THEN it should create a contract', () => {
            cy.kcFakeLogin('user', 'contracts/new');
            cy.wait('@productCategory').then(() => {
              // Then the crumbs are correct
              cy.get('[data-testid="breadcrumbs"]').contains('Create new contract');

              // // And the product category is selected
              cy.selectDropdown('category', 'Product Category A');

              // should not display counter parties
              cy.get('[data-testid="counterparty-roles"]').should('not.exist');

              // // And the product name is selected
              cy.selectDropdown('product', 'Product A');

              // should display fields
              cy.get('[data-testid="contract-name-input"]').should('exist');

              // User enters contract field data
              cy.get('[data-testid="contract-name-input"]').type('A name');

              // should display counter parties
              cy.get('[data-testid="counterparty-roles"]').should('exist');

              // A seller counterparty is present
              cy.get('[data-testid="counterparty-role-0"]').contains(
                products[0].counterpartyRoles[0].name,
              );

              // Should not show mandatory sign
              cy.get('[data-testid="counterparty-role-0"]')
                .find('label')
                .should('not.contain', '*');

              // User types in partial entity name match
              cy.get('[data-testid="counterparty-role-0"]')
                .find('[data-testid="counterparty-entity-control-selector-0"]')
                .find('[data-testid="entity-selector-input"]')
                .type('appl');

              cy.get('[data-testid="entity-selector-option"]').contains('Apple').click();

              // A buyer counterparty is present
              cy.get('[data-testid="counterparty-role-1"]').contains(
                products[0].counterpartyRoles[1].name,
              );

              cy.get('[data-testid="min-tenor"]').type('1');
              cy.get('[data-testid="max-tenor"]').type('2');
              cy.get('[data-testid="spread"]').type('3');
              cy.get('[data-testid="settlement-days"]').type('3');
              cy.selectDropdown('trading-cut-off', '00:00');
              cy.selectDropdown('discount-mode', 'Manual');

              cy.get('[data-testid="advance-rate"]').clear().type('5');
              cy.get('[data-testid="bau-obligor-name"]').type('Billy Bob');
              cy.get('[data-testid="discount-posting"]').type('NETTING');
              cy.get('[data-testid="lead-days"]').type('50');
              cy.selectDropdown('rejection-mode', 'AUTO');

              // should not show mandatory sign
              cy.get('[data-testid="counterparty-role-1"]')
                .find('[data-testid="role-name"]')
                .should('not.contain', '*');

              // And the duplicate check is enabled and some duplicate checks get selected
              cy.get('[data-testid="perform-duplicate-check-cb"]').click();
              makeMultipleDropdownSelections('duplicate-check-fields-multiple-selector', [
                'Invoice no',
                'Currency',
                `Counterparty - ${products[0].counterpartyRoles[0].name}`,
                `Counterparty - ${products[0].counterpartyRoles[1].name}`,
              ]);

              // And the save button is clicked
              cy.get('[data-testid="save"]').click();

              // The new contract page should be shown
              cy.url().should('include', '/contracts/123');

              // Then the correct contract request is made to the server
              cy.wait('@contractCheck').then((xhr) => {
                const expectedRequest = {
                  productCategoryId: 'PCAT A',
                  productCategoryName: 'AR',
                  productName: 'Product A',
                  name: 'A name',
                  status: 'PENDING_APPROVAL',
                  product: 'Product Category A Product A',
                  productId: '123',
                  partnerId: null,
                  channelReference: 'N/A',
                  rules: [],
                  currencies: {},
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
                  bypassTradeAcceptance: false,
                  tradingCutoff: '00:00',
                  maxTenor: 2,
                  minTenor: 1,
                  discountMode: 'MANUAL',
                  advanceRate: 5,
                  automatedPayment: false,
                  bauObligorName: 'Billy Bob',
                  discountPosting: 'NETTING',
                  leadDays: 50,
                  rejectionMode: 'AUTO',
                  hashExpressions: [
                    'cashflow.documentReference',
                    'cashflow.currency',
                    `counterparties.?[role == '${products[0].counterpartyRoles[0].name}'].size() > 0 ? counterparties.?[role == '${products[0].counterpartyRoles[0].name}'][0].entityId : ''`,
                    `counterparties.?[role == '${products[0].counterpartyRoles[1].name}'].size() > 0 ? counterparties.?[role == '${products[0].counterpartyRoles[1].name}'][0].entityId : ''`,
                  ],
                };
                console.log('EXPECTED @@@@@@@@@@@@@@@@');
                console.log(expectedRequest);
                console.log('ACTUAL @@@@@@@@@@@@@@@@');
                console.log(xhr.request.body);
                expect(xhr.request.body).to.eql(expectedRequest);
                // Then the correct counterparty request is made to the server
                cy.wait('@counterpartyCheck').then((counterpartyXhr) => {
                  const expectedCounterparty = {
                    contractId: '123',
                    counterpartyReference: 'SELLER1',
                    entityId: '1',
                    name: 'Apple',
                    role: 'SELLER',
                  };
                  expect(counterpartyXhr.request.body).to.eql(expectedCounterparty);
                });
              });
            });
          });
        });

        describe('WHEN a counterparty is missing', () => {
          it('THEN it should not show an error (because adding counterparty is optional)', () => {
            // When the new contract page is visited
            cy.kcFakeLogin('user', 'contracts/new');

            // And the product category is selected
            cy.selectDropdown('category', 'Product Category A');

            // And the product name is selected
            cy.selectDropdown('product', 'Product A');

            // And user enters contract field data
            cy.get('[data-testid="contract-name-input"]').type('A seller');

            // The save button is clicked
            cy.get('[data-testid="save"]').click();

            // error should show
            cy.get('mat-error[id="mat-error-0"]').should('not.exist');
          });
        });
        describe('WHEN a duplicate counterparty for a role exist', () => {
          it('THEN it should show an error', () => {
            // When the new contract page is visited
            cy.kcFakeLogin('user', 'contracts/new');

            // // And the product category is selected
            cy.selectDropdown('category', 'Product Category A');

            // And the product name is selected
            cy.selectDropdown('product', 'Product A');

            // And user enters contract field data
            cy.get('[data-testid="contract-name-input"]').type('A contract name');

            // entery counterparty role number one
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="counterparty-entity-control-selector-0"]')
              .find('[data-testid="entity-selector-input"]')
              .type('appl');

            cy.get('[data-testid="entity-selector-option"]').contains('Apple').click();

            // The add extra entity on counterparty button is clicked
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="add-entity-button"] a')
              .click();

            // first counterparty second role entry
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="counterparty-entity-control-selector-1"]')
              .find('[data-testid="entity-selector-input"]')
              .type('appl');

            cy.get('[data-testid="entity-selector-option"]').contains('Apple').click();

            // The save button is clicked
            cy.get('[data-testid="save"]').click();

            // error should show
            cy.get('mat-error[id="mat-error-0"]').should('exist');
          });
        });
      });
      describe('WHEN i click on add counterparty role', () => {
        it('THEN a new entity entry box is added', () => {
          cy.kcFakeLogin('user', 'contracts/new');
          cy.selectDropdown('category', 'Product Category A');
          cy.selectDropdown('product', 'Product A');
          cy.get('[data-testid="contract-name-input"]').type('A seller');

          // The add extra entity on counterparty button is clicked
          cy.get('[data-testid="counterparty-role-0"]')
            .find('[data-testid="add-entity-button"] a')
            .click();

          // additional counterparty entry field
          cy.get('[data-testid="counterparty-role-0"]')
            .find('[data-testid="counterparty-entity-control-selector-1"]')
            .should('exist');

          // additional delete button for entry
          cy.get('[data-testid="counterparty-role-0"]')
            .find('[data-testid="entity-delete-button-1"]')
            .should('exist');
        });
        describe('WHEN i delete the first countperparty entry', () => {
          it('THEN only one entry field is shown', () => {
            cy.kcFakeLogin('user', 'contracts/new');
            cy.selectDropdown('category', 'Product Category A');
            cy.selectDropdown('product', 'Product A');
            cy.get('[data-testid="contract-name-input"]').type('A seller');

            // The add extra entity on counterparty button is clicked
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="add-entity-button"] a')
              .click();
            // delete the first
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="entity-delete-button-0"]')
              .click();
            // should only be one
            // additional counterparty entry field
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="counterparty-entity-control-selector-0"]')
              .should('exist');
            cy.get('[data-testid="counterparty-role-0"]')
              .find('[data-testid="counterparty-entity-control-selector-"]')
              .should('not.exist');
          });
        });
      });
    });
  });
});
