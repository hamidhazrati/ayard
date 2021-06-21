describe('Entity', () => {
  describe('GIVEN I view an entity', () => {
    const sampleEntity = {
      id: '123',
      name: 'Coupa',
      dunsNumber: '123456789',
      address: {
        line1: '1 Acacia Avenue',
        line2: 'line2',
        city: 'Salford',
        region: 'Manchester',
        country: 'GB',
        postalCode: 'AB1 2CD',
      },
    };

    it('THEN it should display correct entity details', () => {
      cy.server();
      cy.route('GET', '/entity/123', sampleEntity).as('viewEntity');

      cy.kcFakeLogin('user', 'entities/123');

      cy.get('[data-testid="gs-title"]').contains('Coupa');
    });
  });

  describe('GIVEN I want to create an entity', () => {
    beforeEach(() => {
      cy.kcFakeLogin('user', 'entities/new');
    });

    it('THEN it should display the correct breadcrumb', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('Create new entity');
    });

    it('THEN it should display the create entity page', () => {
      cy.get('[data-testid="title"]').contains('Create new entity');
    });

    describe('WHEN I press cancel', () => {
      it('THEN it will return to the list page', () => {
        cy.get('[data-testid="cancel"]').click();
        cy.location('pathname').should('eq', '/entities');
      });
    });
  });

  describe("WHEN I'm viewing an entity awaiting approval", () => {
    const response = {
      id: '600541b7360cbe62c8072d25',
      name: 'Test',
      dunsNumber: null,
      address: {
        line1: 'Addr line 1 test',
        line2: 'Addr line 2 test',
        city: 'City test',
        region: 'Region test',
        regionName: null,
        country: 'US',
        countryName: 'USA',
        postalCode: '2000',
        postalCodeExtension: null,
      },
      mailingAddress: null,
      registeredAddress: null,
      registrationNumbers: null,
      tradeStyleNames: [
        {
          name: '',
          priority: 1,
        },
      ],
      packagesData: null,
      addressMatchCode1:
        '$$$$$$$$$$$$$$$$$$$$$$$$$$$$~&4$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      addressMatchCode2:
        '$$$$$$$$$$$$$$Z$$$$$$$$$$$$$~&4~$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      organisationNameMatchCode1: '~4$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      organisationNameMatchCode2: '~_4~7PF$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      addressOrganisationMatchCode1:
        '$$$$$$$$$$$$$$$$$$$$$$$$$$$$~&4$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$_~4$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      addressOrganisationMatchCode2:
        '$$$$$$$$$$$$$$Z$$$$$$$$$$$$$~&4~$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$_~_4~7PF$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
      createdBy: 'ops-portal-admin',
      createdAt: '2021-01-18T10:53:46.686Z',
      lastModifiedBy: null,
      lastModifiedAt: null,
      status: 'AWAITING_APPROVAL',
    };

    beforeEach(() => {
      cy.server();
      cy.route('GET', `/entity/${response.id}`, response);
      cy.kcFakeLogin('user', `entities/${response.id}`);
    });

    it('THEN it should display the alert.', () => {
      cy.get('[data-testid="gs-alert-component"]');
    });

    it('THEN it should approve when I have clicked on "approve".', () => {
      cy.get('[data-testid="gs-alert-component"]');
      cy.get('[data-testid="gs-alert-approve-btn"]').click();
      cy.get('[data-testid="gs-confirm-action"]').click();
      cy.route('PUT', `/entity/${response.id}/approve`, {});
      cy.get('[data-testid="gs-title"]').contains('Active');
    });

    it('THEN it should redirect when I "reject" it.', () => {
      cy.get('[data-testid="gs-alert-component"]');
      cy.get('[data-testid="gs-alert-reject-btn"]').click();
      cy.get('[data-testid="gs-rejection-input"]').type('REJECT');
      cy.get('[data-testid="gs-confirm-action"]').click();
      cy.route('DELETE', `/entity/${response.id}/reject`);
      cy.get('[data-testid="gs-title"]').contains('Awaiting Approval');
    });

    it('THEN it should not reject when "REJECT" isn\'t typed.', () => {
      cy.get('[data-testid="gs-alert-component"]');
      cy.get('[data-testid="gs-alert-reject-btn"]').click();
      cy.get('[data-testid="gs-rejection-input"]').type('reject');
      cy.get('[data-testid="gs-confirm-action"]').should('be.disabled');
    });

    it('THEN it should leave entity as it was found when cancel is clicked', () => {
      cy.get('[data-testid="gs-alert-component"]');
      cy.get('[data-testid="gs-alert-reject-btn"]').click();
      cy.get('[data-testid="gs-cancel-action"]').click();
      cy.get('[data-testid="gs-title"]').contains('Awaiting Approval');
    });

    it('THEN it should escape when "cross" is clicked', () => {
      cy.get('[data-testid="gs-alert-component"]');
      cy.get('[data-testid="gs-alert-approve-btn"]').click();
      cy.get('[data-testid="gs-exit-modal"]').click();
      cy.get('[data-testid="gs-title"]').contains('Awaiting Approval');
    });
  });
});
