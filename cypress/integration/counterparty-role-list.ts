describe('List Counter Party roles', () => {
  const response = [
    { id: '1', name: 'roleType Z', description: 'Description Z' },
    { id: '2', name: 'RoleType y', description: 'Description Y' },
    { id: '3', name: 'roleType w', description: 'Description W' },
    { id: '4', name: 'RoleType X', description: 'Description X' },
  ];

  beforeEach(() => {
    cy.server();

    cy.route('GET', '/counterpartyroles?name=abcd', [response[0]]);
    cy.route('GET', '/counterpartyroles', response);
  });

  describe('GIVEN I visit counter party roles list', () => {
    it('THEN counterparty roles are displayed in alphabetical order', () => {
      cy.kcFakeLogin('user', 'counterparty-roles');

      cy.get('[data-testid="crt-name"]').then((elem) => {
        const actualValues = elem.toArray().map((s) => s.innerText);
        const expectedValues = [
          response[2].name,
          response[3].name,
          response[1].name,
          response[0].name,
        ];
        expect(actualValues).to.eql(expectedValues);
      });
    });

    describe('When 2nd row is clicked', () => {
      it('Then the selected counterparty role is shown', () => {
        cy.get('[data-testid="counterparty-role-row-1').click();

        // Then the selected counterparty role is shown
        cy.url().should('include', '/counterparty-roles/4');
      });
    });

    describe('When the create new counterparty role button is clicked', () => {
      it('Then the the create new counterparty role page is displayed', () => {
        cy.kcFakeLogin('user', 'counterparty-roles');

        cy.equalsTrimmed(
          'create-new-counterparty-role-btn',
          'Create new counterparty role',
        ).click();

        cy.url().should('include', '/counterparty-roles/new');
      });
    });
  });
});
