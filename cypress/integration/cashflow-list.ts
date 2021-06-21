import { formatNumber } from '@angular/common';

describe('List cashflows succeeds', () => {
  const response = [
    {
      id: 'id1',
      partnerId: 'COUPA-PARTNER-DEMO',
      channelReference: 'TEST-CHANNEL-REFERENCE-1',
      state: 'BLOCKED',
      externalReference: '123',
      counterparties: [
        {
          counterpartyId: '123000',
          documentReference: 'Counterparty document reference',
        },
      ],
      contractId: 'cid123',
      documentType: 'INVOICE',
      createdAt: '2020-06-16T15:23:01.394Z',
      issueDate: '2020-05-01',
      originalDueDate: '2020-11-01',
      certifiedAmount: 10000,
      currency: 'USD',
      unitPrice: 156334,
      units: 5,
      description: '23 tonnes of steel',
    },
  ];

  beforeEach(() => {
    cy.server();

    cy.route('GET', '/cashflow', response);
  });

  it('Should list cashflows', () => {
    // When the new product page is visited
    cy.kcFakeLogin('user', 'cashflows');

    // Then the breadcrumbs are correct
    cy.get('[data-testid="breadcrumbs"]').contains('Cashflows');

    cy.get('[data-testid="invoice-id"]').contains(response[0].externalReference);

    cy.get('[data-testid="invoice-amount"]').contains(
      formatNumber(response[0].certifiedAmount, 'en-US', '1.2'),
    );

    cy.get('[data-testid="currency"]').contains(response[0].currency);

    cy.get('[data-testid="invoice-date"]').contains(response[0].issueDate);

    cy.get('[data-testid="due-date"]').contains(response[0].originalDueDate);

    cy.get('[data-testid="status"]').contains(response[0].state);

    // when cashflow row clicked
    cy.get('[data-testid="cashflow-row-0"]').click({ force: true });

    // then should load specific cashflow
    cy.url().should('include', `/cashflows/${response[0].id}`);
  });
});
