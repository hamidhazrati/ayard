import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';
import { RelationshipFacility } from '@app/features/facilities/models/facility.model';

describe('Facilities', () => {
  const response: FacilityProjection[] = [
    {
      date: '2021-01-22',
      facility: {
        type: 'relationship-facility',
        name: 'My facility',
        entity: {
          id: '123',
          name: 'My entity',
          dunsNumber: '123',
        },
        currency: 'USD',
        limits: [
          {
            type: 'total-limit',
            limit: 1234567890,
            limitType: 'CREDIT',
            defaultLimit: false,
            exceptionCode: 'CREDIT',
          },
        ],
        children: [],
        id: 'facility1',
        exceptionCode: 'RELATIONSHIP',
      } as RelationshipFacility,
      exposure: {
        type: 'homogenous-exposure-set',
        results: [
          {
            classification: {
              type: 'homogenous',
            },
            results: [
              {
                classification: {
                  type: 'homogenous',
                },
                currency: 'USD',
                total: 1234567890,
                used: 5555555,
                available: 1229012335,
                balance: {
                  currency: 'USD',
                  provisionalInvestment: 0,
                  earmarkedInvestment: 1111111,
                  investment: 4444444,
                  maturity: 0,
                  earmarkedMaturity: 0,
                  provisionalMaturity: 0,
                  lockedMaturity: 0,
                  lockedInvestment: 5555555,
                },
                limit: {
                  type: 'total-limit',
                  limit: 1234567890,
                  limitType: 'CREDIT',
                  defaultLimit: false,
                  exceptionCode: 'CREDIT',
                },
                breached: false,
                ok: true,
              },
            ],
          },
        ],
      },
      children: [],
    },
    {
      date: '2021-01-22',
      facility: {
        type: 'relationship-facility',
        name: 'JT Test',
        entity: null,
        currency: 'USD',
        limits: [],
        children: [],
        id: '600aa84c0942b31f87c6fb1c',
        exceptionCode: 'RELATIONSHIP',
      } as RelationshipFacility,
      exposure: {
        type: 'homogenous-exposure-set',
        results: [],
      },
      children: [],
    },
  ];
  beforeEach(() => {
    cy.server();

    cy.route('GET', '/exposure/facility', response);
  });

  describe('GIVEN I visit facilities list', () => {
    it('THEN breadcrumbs are displayed', () => {
      cy.kcFakeLogin('user', 'facilities');

      cy.get('[data-testid="breadcrumbs"]').contains('Facilities & Limits');
    });

    it('THEN facilities are displayed', () => {
      cy.get('[data-testid="facility-name"]').contains(response[0].facility.name);
      cy.get('[data-testid="facility-currency"]').contains(response[0].facility.currency);
      cy.get('[data-testid="facility-limit"]').contains('1,234,567,890');
      cy.get('[data-testid="facility-exposure"]').contains('5,555,555');
      cy.get('[data-testid="facility-available"]').contains('1,229,012,335');
    });
  });

  describe('WHEN first row is clicked', () => {
    it('THEN the selected facility is shown', () => {
      cy.get('[data-testid="facility-row-0"]').click({ force: true });

      cy.url().should('include', `/facilities/${response[0].facility.id}`);
    });
  });
});
