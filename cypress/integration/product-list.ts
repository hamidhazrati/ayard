import { ProductCategory } from '@app/features/product-categories/models/product-category.model';

describe('Products', () => {
  let response: ProductCategory[];
  before(() => cy.fixture('product-category.json').then((categories) => (response = categories)));

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/product-category?includeProducts=true', response);
  });

  describe('GIVEN I visit product list', () => {
    it('THEN products are displayed in alphabetical order', () => {
      cy.kcFakeLogin('user', 'products');

      cy.get('[data-testid="product-name"]').then((elem) => {
        const actualValues = elem.toArray().map((s) => s.innerText);
        const expectedValues = [
          response[0].name,
          response[0].products[0].name,
          response[1].name,
          response[1].products[0].name,
          response[1].products[1].name,
        ];
        expect(actualValues).to.eql(expectedValues);
      });
    });
  });

  describe('When 2nd product row in 2nd category is clicked', () => {
    it('Then the selected product is shown', () => {
      cy.kcFakeLogin('user', 'products');

      cy.get('[data-testid="product-row-4"').click();

      cy.url().should('include', '/products/3');
    });
  });

  describe('When 2nd category row is clicked', () => {
    it('Then the selected product category is shown', () => {
      cy.kcFakeLogin('user', 'products');

      cy.get('[data-testid="product-row-2"').click();

      cy.url().should('include', '/product-categories/CAT%20B');
    });
  });

  describe('When the create new product button is clicked', () => {
    it('Then the the create new product page is displayed', () => {
      cy.kcFakeLogin('user', 'products');
      cy.equalsTrimmed('create-new-product-btn', 'Create new product').click();
      cy.url().should('include', '/products/new');
    });
  });
});
