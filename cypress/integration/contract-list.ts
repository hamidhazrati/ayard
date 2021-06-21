describe('Contracts', () => {
  const response = [
    {
      id: '210afbb9-91e5-42e5-9c1b-9474bbce691c',
      name: 'Coupa contract 2',
      channelReference: '1234',
      partnerId: 'COUPA-PARTNER-2',
      status: 'ACTIVE',
      product: 'SCF',
      created: '2021-01-15T09:58:10.023Z',
    },
    {
      id: '180afbb9-91e5-42e5-9c1b-9474bbce691c',
      name: 'Coupa contract',
      channelReference: '123',
      partnerId: 'COUPA-PARTNER-1',
      status: 'PENDING_APPROVAL',
      product: 'SCF',
      created: '2021-01-14T09:58:10.023Z',
    },
  ];

  const page = {
    data: response,
    meta: {
      paged: {
        size: 2,
        page: 0,
        totalPages: 1,
        pageSize: 10,
        totalSize: 2,
      },
    },
  };

  describe('GIVEN I visit contract list', () => {
    beforeEach(() => {
      cy.server();

      cy.route('GET', '/contract/v2/list?page=0&size=10&sort=created,desc&name_contains=', page);
    });
    it('THEN breadcrumbs are displayed', () => {
      cy.kcFakeLogin('user', 'contracts');

      cy.get('[data-testid="breadcrumbs"]').contains('Contracts');
    });

    it('THEN contracts are displayed in order by created', () => {
      cy.get('[data-testid="name"]').then((name) => {
        const actualNameValues = name.toArray().map((s) => s.innerText);
        expect(actualNameValues).to.eql([response[0].name, response[1].name]);
      });

      cy.get('[data-testid="status"]').then((status) => {
        const actualStatusValues = status.toArray().map((s) => s.innerText);
        expect(actualStatusValues).to.eql(['Active', 'Pending Approval']);
      });
    });
  });

  describe('When a search is made', () => {
    before(() => {
      cy.server();
      cy.route(
        'GET',
        '/contract/v2/list?page=0&size=10&sort=created,desc&name_contains=contract',
        page,
      ).as('getContracts');
    });

    it('Then a request is made with the search value', () => {
      cy.get('gds-search').type('contract');
      cy.wait('@getContracts').its('status').should('eq', 200);
    });
  });

  describe('When first row is clicked', () => {
    it('Then the selected contract is shown', () => {
      cy.get('[data-testid="name"]').first().click({ force: true });
      cy.url().should('include', `/contracts/${response[0].id}`);
    });
  });
});
