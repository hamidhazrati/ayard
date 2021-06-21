import { RelationshipFacility } from '@app/features/facilities/models/facility.model';
import { FacilityProjection } from '@app/features/facilities/models/facility-projection.model';

describe('Facilities', () => {
  const response: FacilityProjection = {
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
  };

  beforeEach(() => {
    cy.server();

    cy.route('GET', `/exposure/facility/${response.facility.id}`, response);
  });

  describe('GIVEN I view a facility', () => {
    it('THEN breadcrumbs are displayed', () => {
      cy.kcFakeLogin('user', `facilities/${response.facility.id}`);

      cy.get('[data-testid="breadcrumbs"]').contains('Facilities & Limits');
      cy.get('[data-testid="breadcrumbs"]').contains('My facility');
    });

    it('THEN facilities are displayed', () => {
      cy.get('[data-testid="facility-name"]').contains(response.facility.name);
      cy.get('[data-testid="facility-currency"]').contains(response.facility.currency);
      cy.get('[data-testid="facility-limit"]').contains('1,234,567,890');
      cy.get('[data-testid="facility-exposure"]').contains('5,555,555');
      cy.get('[data-testid="facility-available"]').contains('1,229,012,335');
    });
  });
});
