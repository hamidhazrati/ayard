import { CounterpartyRole } from '@app/features/counterparty-roles/models/counterparty.role';
import { CreateUpdateProduct } from '@app/features/products/models/product.model';

describe('Create product', () => {
  const counterpartyRoleResponse: CounterpartyRole[] = [
    { id: '1234', name: 'SELLER', description: 'A seller', required: false },
    { id: '2312', name: 'BUYER', description: 'A buyer', required: false },
  ];

  let categoryResponse;
  before(() => {
    cy.fixture('product-category.json').then((categories) => {
      categoryResponse = categories;
      categoryResponse.forEach((cat) => (cat.products = []));
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/product-category?includeProducts=false', categoryResponse);
  });

  describe('GIVEN I visit the new product page', () => {
    describe('WHEN details are entered and save is clicked', () => {
      it('THEN it should create a new product', () => {
        cy.server();
        const response = { id: '123' };

        cy.route('GET', 'product?productCategoryId=CAT A&name=SCF product', []).as('nameCheck');
        cy.route('POST', '/product', response).as('productCheck');

        // When the new product page is visited
        cy.kcFakeLogin('user', 'products/new');

        // Then the breadcrumbs are correct
        cy.get('[data-testid="breadcrumbs"]').contains('Create new product');

        // And the correct details are created
        cy.equalsTrimmed('page-title', 'Create a New Product');

        // And the status is selected
        cy.selectDropdown('product-status-select', 'Active');

        // And the product category is entered
        cy.selectDropdown('product-category-select', 'Product Category A');

        // And the product is entered
        cy.get('[data-testid="product-name"]').type('SCF product');

        // And the description is entered
        cy.get('[data-testid="product-description-textarea"]').type('SCF product description');

        // And the product guide link is entered
        cy.get('[data-testid="product-guide-link"]').type('http://abc.xyz');

        // And the save button is clicked
        cy.wait('@nameCheck').then((xhr) => {
          cy.get('[data-testid="save"]').click({ force: true });
        });

        // Then the correct request is made to the server
        cy.wait('@productCheck').then((xhr) => {
          const expectedRequest: CreateUpdateProduct = {
            productCategoryId: 'CAT A',
            name: 'SCF product',
            description: 'SCF product description',
            status: 'ACTIVE',
            productGuideLink: 'http://abc.xyz',
            counterpartyRoles: [],
            rules: [],
            parameters: {},
          };
          expect(xhr.request.body).to.eql(expectedRequest);
        });
        cy.url().should('include', '/products');
      });

      describe('WHEN server returns an error', () => {
        it('THEN if should display error returned from server', () => {
          const response = { title: 'Validation error', details: [{description:'link'}] };

          cy.route('GET', 'product?productCategoryId=CAT A&name=SCF product', []);
          cy.route({ method: 'POST', url: '/product', response, status: 409 }).as('productCheck');

          // When the new product page is visited
          cy.kcFakeLogin('user', 'products/new');

          // Then the breadcrumbs are correct
          cy.get('[data-testid="breadcrumbs"]').contains('Create new product');

          // And the correct details are created
          cy.get('[data-testid="page-title"]').contains('Create a New Product');

          // And the status is selected
          cy.selectDropdown('product-status-select', 'Active');

          // And the product category is entered
          cy.selectDropdown('product-category-select', 'Product Category A');

          // And the product name is entered
          cy.get('[data-testid="product-name"]').type('SCF product');

          // And the description is entered
          cy.get('[data-testid="product-description-textarea"]').type('SCF product description');

          // And the product guide link is entered
          cy.get('[data-testid="product-guide-link"]').type('xyz');

          // And the save button is clicked
          cy.get('[data-testid="save"]').click({ force: true });

          cy.wait('@productCheck').then((xhr) => {
            // And the save button is clicked
            cy.get('[data-testid="server-error"]').should('have.text', ' Validation error  - link ');
          });
        });
      });

      describe('WHEN only mandatory fields are entered', () => {
        it('THEN it should create a new product with mandatory fields only', () => {
          cy.server();
          const response = { id: '123' };

          cy.route('GET', 'product?productCategoryId=CAT A&name=SCF product', []).as('nameCheck');
          cy.route('POST', '/product', response).as('productCheck');

          // When the new product page is visited
          cy.kcFakeLogin('user', 'products/new');

          // Then the breadcrumbs are correct
          cy.get('[data-testid="breadcrumbs"]').contains('Create new product');

          // And the correct details are created
          cy.get('[data-testid="page-title"]').contains('Create a New Product');

          // And the status is selected
          cy.selectDropdown('product-status-select', 'Disabled');

          // And the product category is entered
          cy.selectDropdown('product-category-select', 'Product Category A');

          // And the product name is entered
          cy.get('[data-testid="product-name"]').type('SCF product');

          // And the description is entered
          cy.get('[data-testid="product-description-textarea"]').type('SCF product description');

          // And the save button is clicked
          cy.wait('@nameCheck').then((xhr) => {
            cy.get('[data-testid="save"]').click({ force: true });
          });

          // Then the correct request is made to the server
          cy.wait('@productCheck').then((xhr) => {
            const expectedRequest: CreateUpdateProduct = {
              productCategoryId: 'CAT A',
              name: 'SCF product',
              description: 'SCF product description',
              status: 'DISABLED',
              productGuideLink: '',
              counterpartyRoles: [],
              rules: [],
              parameters: {},
            };

            expect(xhr.request.body).to.eql(expectedRequest);
          });

          cy.url().should('include', '/products');
        });
      });
    });

    describe('WHEN counterparties are to be added to the product', () => {
      describe('WHEN the user adds counterparties', () => {
        it('THEN it should allow counterparties to be added to create product', () => {
          cy.server();
          cy.route('GET', '/counterpartyroles', counterpartyRoleResponse).as('list');
          cy.kcFakeLogin('user', 'products/new');

          cy.get('[data-testid="counterparty-roles-tab"]').click();

          cy.get('[data-testid="add-counterpartyrole-button"]').click();

          cy.wait(200);
          cy.get('[data-testid="counterparty-roles"]')
            .should('be.visible')
            .contains(counterpartyRoleResponse[0].name)
            .click();

          cy.get('[data-testid="role-type-select"]').should('be.visible');
          cy.selectDropdown('role-type-select', 'Primary');

          cy.get('[data-testid="counterparty-role-configurator"]')
            .find('[data-testid="save"]')
            .click();

          cy.get('[data-testid="product-counterparties-list"]')
            .contains(counterpartyRoleResponse[0].name)
            .should('be.visible');

          cy.get('[data-testid="add-counterpartyrole-button"]').click();

          cy.wait(200);
          cy.get('[data-testid="counterparty-roles"]')
            .should('be.visible')
            .contains(counterpartyRoleResponse[1].name)
            .click();

          cy.get('[data-testid="counterparty-roles"]')
            .contains(counterpartyRoleResponse[0].name)
            .should('not.be.visible');

          cy.get('[data-testid="role-type-select"]').should('be.visible');
          cy.selectDropdown('role-type-select', 'Related');

          cy.get('[data-testid="counterparty-role-configurator"]')
            .find('[data-testid="save"]')
            .click();

          cy.get('[data-testid="product-counterparties-list"]')
            .contains(counterpartyRoleResponse[1].name)
            .should('be.visible');
        });
      });

      describe('WHEN the user adds counterparties', () => {
        it('THEN it should remove counterparties from the product when delete is clicked', () => {
          // Given
          cy.route('GET', '/counterpartyroles', counterpartyRoleResponse);
          cy.kcFakeLogin('user', 'products/new');

          cy.get('[data-testid="counterparty-roles-tab"]').click();

          cy.get('[data-testid="add-counterpartyrole-button"]').click();

          cy.wait(200);
          cy.get('[data-testid="counterparty-roles"]')
            .should('be.visible')
            .contains(counterpartyRoleResponse[0].name)
            .click();

          cy.get('[data-testid="role-type-select"]').should('be.visible');
          cy.selectDropdown('role-type-select', 'Related');

          cy.get('[data-testid="counterparty-role-configurator"]')
            .find('[data-testid="save"]')
            .click();

          cy.wait(200);
          cy.get('[data-testid="counterparty-roles-tab"]').click();

          cy.get('[data-testid="product-counterparty-delete"]').click();

          cy.get('[data-testid="product-counterparties-list"]')
            .contains(counterpartyRoleResponse[0].name)
            .should('be.not.visible');
        });
      });
    });
  });
});
