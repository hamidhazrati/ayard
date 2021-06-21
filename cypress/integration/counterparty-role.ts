describe('Counterparty role', () => {
  beforeEach(() => {
    cy.server();
  });

  describe('GIVEN the API returns an OK response', () => {
    it('THEN I can create a new counterparty role', () => {
      const response = { id: '123' };
      cy.route('POST', '/counterpartyroles', response).as('counterpartyRoleCheck');

      cy.kcFakeLogin('user', 'counterparty-roles/new');

      cy.get('[data-testid="name"]').type('Seller');
      cy.get('[data-testid="description"]').type('A seller');
      cy.get('[data-testid="save"]').click();

      cy.wait('@counterpartyRoleCheck').then((xhr) => {
        const expectedRequest = {
          name: 'Seller',
          description: 'A seller',
          required: false,
        };
        expect(xhr.request.body).to.eql(expectedRequest);
      });

      cy.url().should('include', '/');
    });
  });

  describe('GIVEN the API returns an Error response ', () => {
    it('THEN it displays an MVP error', () => {
      const response = { title: 'server error' };

      cy.route({ method: 'POST', url: '/counterpartyroles', response, status: 409 }).as(
        'counterpartyRoleCheck',
      );

      cy.kcFakeLogin('user', 'counterparty-roles/new');

      cy.get('[data-testid="name"]').type('Seller');
      cy.get('[data-testid="description"]').type('A seller');
      cy.get('[data-testid="save"]').click();

      cy.wait('@counterpartyRoleCheck').then((xhr) => {
        cy.get('[data-testid="server-error"]').should('have.text', 'server error');
      });
    });
  });
});
