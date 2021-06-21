describe('View MatchCandidate and Create entity', () => {
  describe('GIVEN I want to create an entity from match candidate', () => {
    beforeEach(() => {
      cy.kcFakeLogin('user', 'entities/matchcandidates/123456789');
      const response = [
        {
          id: '123',
          entityId: null,
          name: 'ABC',
          dunsNumber: '123456789',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            country: 'GB',
            region: 'Asia',
            regionName: 'Asia',
            postalCodeExtension: '2000',
            countryName: 'United Kingdom',
            postalCode: '2000',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
      ];
      cy.server();
      cy.route('GET', '/entity/matchcandidates?dunsNumber=123456789', response).as('searchEntity');
    });

    it('THEN it should display the correct breadcrumb', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('ABC');
    });

    it('THEN it should display match candidate details and save and canel buttons', () => {
      cy.get('[data-testid="title"]').contains('ABC');
      cy.get('[data-testid="duns-number"]').contains('123456789');
      cy.get('[data-testid="address-line-1"]').contains('Line 1');
      cy.get('[data-testid="address-line-2"]').contains('Line 2');
      cy.get('[data-testid="city"]').contains('city');
      cy.get('[data-testid="country"]').contains('United Kingdom');
      cy.get('[data-testid="postcode"]').contains('2000');

      cy.get('[data-testid="save"]');
      cy.get('[data-testid="cancel"]');
    });

    describe('WHEN I press save button', () => {
      it('THEN it should create new entity and navigate to entity details page', () => {
        cy.route('POST', '/entity/123456789', { id: '123-123-123' }).as('createEntity');

        cy.get('[data-testid="save"]').click();

        cy.url().should('include', `/entities/123-123-123`);
      });
    });
  });
});
