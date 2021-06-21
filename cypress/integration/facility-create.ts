import { Entity } from '@entities/models/entity.model';
import { Currency } from '@app/services/currency/currency.model';

describe('Create facility', () => {
  const stubCurrencies = [
    {
      code: 'USD',
      decimalPlaces: 3,
      dayCountConventionCode: 'actual/365',
    },
    {
      code: 'JPY',
      decimalPlaces: 3,
      dayCountConventionCode: 'actual/365',
    },
    {
      code: 'EUR',
      decimalPlaces: 3,
      dayCountConventionCode: 'actual/365',
    },
    {
      code: 'GBP',
      decimalPlaces: 3,
      dayCountConventionCode: 'actual/365',
    },
  ] as Currency[];

  const entities = [
    {
      id: '1',
      name: 'Apple',
      dunsNumber: '123',
    },
    {
      id: '2',
      name: 'Appliances Online',
      dunsNumber: '456',
    },
  ] as Entity[];

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/currencies', stubCurrencies).as('currencies');
    cy.route('GET', '/entity?name=[*]appl', entities);
    const operationResponse = { id: '123' };
    cy.route('POST', '/facility/operate', operationResponse).as('operateCheck');
  });

  describe('GIVEN I visit the new facility page', () => {
    describe('WHEN the save button is clicked', () => {
      describe('WHEN the form is filled completely', () => {
        it('THEN it should create a facility', () => {
          cy.route('POST', '/facility/search', []).as('facilitySearch');

          cy.kcFakeLogin('user', 'facilities/new');
          cy.wait('@currencies').then(() => {
            // Then the crumbs are correct
            cy.get('[data-testid="breadcrumbs"]').contains('Create new limit configuration');

            cy.get('[data-testid="name"]').type('A name');
            cy.wait('@facilitySearch').then(() => {
              cy.selectDropdown('currency', 'USD');
              cy.get('[data-testid="entity-selector-input"]').type('appl');
              cy.get('[data-testid="entity-selector-option"]').contains('Apple').click();
              cy.get('[data-testid="save"]').click();

              // The new contract page should be shown
              cy.url().should('include', '/facilities/123');

              // Then the correct contract request is made to the server
              cy.wait('@operateCheck').then((xhr) => {
                const expectedRequest = {
                  type: 'create-root-facility-operation',
                  name: 'A name',
                  currency: 'USD',
                  children: null,
                  entity: {
                    id: '1',
                    name: 'Apple',
                    dunsNumber: '123',
                  },
                  limits: null,
                };
                expect(xhr.request.body).to.eql(expectedRequest);
              });
            });
          });
        });
      });

      describe('WHEN the form is filled without entity', () => {
        it('THEN it should create a facility without an entity', () => {
          cy.route('POST', '/facility/search', []).as('facilitySearch');

          cy.kcFakeLogin('user', 'facilities/new');
          cy.wait('@currencies').then(() => {
            // Then the crumbs are correct
            cy.get('[data-testid="breadcrumbs"]').contains('Create new limit configuration');

            cy.get('[data-testid="name"]').type('A name');

            cy.wait('@facilitySearch').then(() => {
              cy.selectDropdown('currency', 'USD');
              cy.get('[data-testid="save"]').click();

              // The new contract page should be shown
              cy.url().should('include', '/facilities/123');

              // Then the correct contract request is made to the server
              cy.wait('@operateCheck').then((xhr) => {
                const expectedRequest = {
                  type: 'create-root-facility-operation',
                  name: 'A name',
                  currency: 'USD',
                  children: null,
                  entity: null,
                  limits: null,
                };
                expect(xhr.request.body).to.eql(expectedRequest);
              });
            });
          });
        });
      });

      describe('WHEN the form is filled and the name is non-unique', () => {
        it('THEN it should display an error', () => {
          cy.route('POST', '/facility/search', [{ name: 'A name' }]).as('facilitySearch');

          cy.kcFakeLogin('user', 'facilities/new');
          cy.wait('@currencies').then(() => {
            // Then the crumbs are correct
            cy.get('[data-testid="breadcrumbs"]').contains('Create new limit configuration');

            cy.get('[data-testid="name"]').type('A name');

            cy.wait('@facilitySearch').then(() => {
              cy.get('[data-testid="save"]').click();
              cy.get('[data-testid="name-error"]').contains('already exists');
            });

            // The new contract page should be shown
            cy.url().should('not.include', '/facilities/123');
          });
        });
      });
    });
  });
});
