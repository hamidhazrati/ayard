describe('Entity Resolve', () => {
  context('Resolve form.', () => {
    beforeEach(() => {
      cy.server();
      cy.kcFakeLogin('user', 'entities/resolve');
    });

    it('should land on resolve page', () => {
      cy.get('[data-testid="title"]').contains('Search and Filter');
    });

    it('should show error when entity name is submitted without country', () => {
      // select a dropdown item
      cy.get('[data-testid="name"]').type('Vodafone');
      cy.get('[data-testid="search-btn"]').click();
      cy.get('[data-testid="country-required"]').contains('Please select country');
    });

    it('should show error when address and postal code is submitted without country', () => {
      // select a dropdown item
      cy.get('[data-testid="postal-code"]').type('SW1W 9TQ');
      cy.get('[data-testid="address"]').type('76 Buckingham Palace Road');
      cy.get('[data-testid="search-btn"]').click();
      cy.get('[data-testid="country-required"]').contains('Please select country');
      cy.get('[data-testid="name-required"]').contains('Please enter entity name');
    });

    it('should show error when region is submitted without country', () => {
      // select a dropdown item
      cy.get('[data-testid="region"]').type('Dallas, TX');
      cy.get('[data-testid="search-btn"]').click();
      cy.get('[data-testid="country-required"]').contains('Please select country');
      cy.get('[data-testid="name-required"]').contains('Please enter entity name');
    });
  });

  context('Resolve results interaction', () => {
    beforeEach(() => {
      cy.server();
      cy.kcFakeLogin('user', 'entities/resolve');
    });

    it('should show matching entities when I click on search button', () => {
      const response = [
        {
          id: '123',
          name: 'Vodafone',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            region: 'region',
            regionName: 'region name',
            country: 'GB',
            postalCode: '2000',
            postalCodeExtension: '2000',
            countryName: 'Australia',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
        {
          id: '123',
          name: 'Vodafone',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            region: 'region',
            regionName: 'region name',
            country: 'GB',
            postalCode: '2000',
            postalCodeExtension: '2000',
            countryName: 'Australia',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
        {
          id: '123',
          name: 'Vodafone',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            region: 'region',
            regionName: 'region name',
            country: 'GB',
            postalCode: '2000',
            postalCodeExtension: '2000',
            countryName: 'Australia',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
      ];
      cy.server();
      cy.route({
        method: 'GET',
        url: '/entity/matchcandidates?country=US&name=Vodafone&dunsNumber=123456789',
        status: 200,
        response,
      });
      cy.get('[data-testid="country"]').click().get('mat-option').contains('USA').click();
      cy.get('[data-testid="duns-number"]').type('123456789');
      cy.get('[data-testid="name"]').type('Vodafone');
      cy.get('[data-testid="search-btn"]').click();
      cy.get('[data-testid="matching-entities-number"]').contains('3 entities found');
    });

    it('it should show the region shortname when there is no regionName', () => {
      const response = [
        {
          id: '123',
          name: 'Vodafone',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'Sacramento',
            region: 'CA',
            regionName: null,
            country: 'US',
            postalCode: '2000',
            postalCodeExtension: '2000',
            countryName: 'United States',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
      ];
      cy.route({
        method: 'GET',
        url: '/entity/matchcandidates?country=US&name=Vodafone&dunsNumber=123456789',
        status: 200,
        response,
      });
      cy.get('[data-testid="country"]').click().get('mat-option').contains('USA').click();
      cy.get('[data-testid="duns-number"]').type('123456789');
      cy.get('[data-testid="name"]').type('Vodafone');
      cy.get('[data-testid="search-btn"]').click();

      // cy.get('[data-testid="address"]').contains('CA');
    });
  });

  context('Resolve results further interaction', () => {
    beforeEach(() => {
      cy.server();
      cy.kcFakeLogin('user', 'entities/resolve');

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
            region: 'region',
            country: 'GB',
            postalCode: '2000',
            regionName: 'Asia',
            postalCodeExtension: '2000',
            countryName: 'Australia',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
        {
          id: '123',
          entityId: '123-123-123',
          name: 'ABC',
          dunsNumber: '757551635',
          entityIds: null,
          primaryAddress: {
            line1: 'Line 1',
            line2: 'Line 2',
            city: 'city',
            region: 'region',
            country: 'GB',
            regionName: 'Asia',
            postalCodeExtension: '2000',
            countryName: 'Australia',
            postalCode: '2000',
          },
          matchScore: 95.0,
          status: 'ACTIVE',
        },
      ];
      cy.route({
        method: 'GET',
        url: '/entity/matchcandidates?country=US&name=Vodafone',
        status: 200,
        response,
      });
    });

    it('should create a new entity when I click on one listed.', () => {
      cy.get('[data-testid="country"]').click().get('mat-option').contains('USA').click();
      cy.get('[data-testid="name"]').type('Vodafone');
      cy.get('[data-testid="search-btn"]').click();

      cy.get('[data-testid="create-entity"]').click();
      cy.url().should('include', `/entities/matchcandidates/123456789`);
    });

    it('should navigate me to the entity details page', () => {
      cy.get('[data-testid="country"]').click().get('mat-option').contains('USA').click();
      cy.get('[data-testid="name"]').type('Vodafone');
      cy.get('[data-testid="search-btn"]').click();
      cy.get('[data-testid="view-entity"]').click();
      cy.url().should('include', `/entities/123-123-123`);
    });
  });
});
