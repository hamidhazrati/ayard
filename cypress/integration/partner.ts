import { PartnerRequest } from '@app/features/partners/services/partner.service';
import { Entity } from '@entities/models/entity.model';
import { PARTNERS_PAGE } from '../fixtures/partners/partners';
import { Page } from '@app/shared/pagination';
import { Partner } from '@app/features/partners/model/partner.model';

describe('Partners', () => {
  const partnersPage: Page<Partner> = PARTNERS_PAGE;

  const entities = [
    {
      id: '1',
      name: 'Katerra',
    },
    {
      id: '2',
      name: 'Some Other Entity',
    },
  ] as Entity[];

  beforeEach(() => {
    cy.server();

    cy.route('GET', '/partner?name_starts_with=&page=0&size=10&sort=name,asc', partnersPage);
  });

  describe('GIVEN I visit partner list', () => {
    it('THEN breadcrumbs are displayed', () => {
      cy.kcFakeLogin('user', 'partners');

      cy.get('[data-testid="breadcrumbs"]').contains('Partners');
    });

    it('THEN partners are displayed', () => {
      cy.get('[data-testid="name"]').then((elem) => {
        const actualValues = elem.toArray().map((s) => s.innerText);
        expect(actualValues).to.eql([
          partnersPage.data[0].name,
          partnersPage.data[1].name,
          partnersPage.data[2].name,
          partnersPage.data[3].name,
          partnersPage.data[4].name,
        ]);
      });
    });
  });

  describe('GIVEN I visit the create new partner page', () => {
    beforeEach(() => {
      cy.kcFakeLogin('user', 'partners/new');
    });

    it('THEN it should display the correct breadcrumb', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('Create new partner');
    });

    it('THEN it should display the create partner page', () => {
      cy.get('[data-testid="page-title"]').contains('Create new partner');
    });

    describe('WHEN valid form fields are submitted', () => {
      beforeEach(() => {
        cy.get('[data-testid="partner-name"]').type('Some New Partner');
        cy.get('[data-testid="partner-id"]').type('some new partner 1');
        cy.get('[data-testid="entity-selector-input"]').type('Kat');

        cy.route('GET', '/entity?name=[*]Kat', entities).as('filterEntity');
        cy.wait('@filterEntity');

        cy.get('[data-testid="entity-selector-option"]').contains('Katerra').click();
      });

      it('THEN the new partner should be created', () => {
        const response = { id: '123' };

        cy.route({ method: 'POST', url: '/partner', response, status: 201 }).as('createPartner');
        cy.get('[data-testid="partner-submit"]').click();

        cy.wait('@createPartner').then((xhr) => {
          const expectedRequest: PartnerRequest = {
            name: 'Some New Partner',
            id: 'some new partner 1',
            entityId: '1',
          };

          expect(xhr.request.body).to.eql(expectedRequest);
        });
      });

      describe('WHEN the server returns status 409', () => {
        it('THEN the appropriate failure message should be displayed', () => {
          const response = {
            status: 409,
            title: 'Duplicate',
            code: 'DUPLICATE',
            details: [
              {
                target: '{"name": "Some Partner 1" }',
                description: 'Duplicate key: {"name": "Some Partner 1" }',
              },
            ],
          };

          cy.route({ method: 'POST', url: '/partner', response, status: 409 }).as('createPartner');
          cy.get('[data-testid="partner-submit"]').click();

          cy.wait('@createPartner').then((xhr) => {
            cy.get('[data-testid="server-error"]').should(
              'have.text',
              'Partner name already exists',
            );
          });
        });
      });
    });
  });
});
