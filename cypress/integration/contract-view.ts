describe('Contract View', () => {
  describe('GIVEN a contract', () => {
    const sampleContract = {
      id: '2e57be46-07fa-4486-8e80-dd4282b74be0',
      name: 'AR_Test Hogcat Industries Base',
      channelReference: 'N/A',
      partnerId: 'abc-123',
      created: '2020-06-18',
      status: 'Active',
      pricing: null,
      product: 'AR_Test Hogcat Industries Base',
      rules: [
        {
          name: 'Max Seller Drift',
          resource: 'PRICING',
          expression: 'cashflow.seller.drift > contract.maxdrift',
          message: 'Maximum drift has occurred for this seller',
          code: 'MAX_SELLER_DRIFT',
          target: 'seller',
        },
      ],
    };
    describe('WHEN we visit the view contract screens', () => {
      it('THEN it should display the correct details', () => {
        cy.server();
        cy.route('GET', '/contract/2e57be46-07fa-4486-8e80-dd4282b74be0', sampleContract).as(
          'viewContract',
        );

        cy.kcFakeLogin('user', 'contracts/2e57be46-07fa-4486-8e80-dd4282b74be0');

        cy.get('[data-testid="contract-id"]').contains('2e57be46-07fa-4486-8e80-dd4282b74be0');
        cy.get('[data-testid="contract-name"]').contains('AR_Test Hogcat Industries Base');
        cy.get('[data-testid="contract-status"]').contains('Active');
        cy.get('[data-testid="contract-product"]').contains('AR_Test Hogcat Industries Base');
        cy.get('[data-testid="partner-id"]').contains('abc-123');
        cy.get('[data-testid="contract-created"]').contains('18 Jun 2020');
      });
    });
  });
});
