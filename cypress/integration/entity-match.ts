describe('Entity Match', () => {
  describe('GIVEN I wish to see matching entities for a match request id', () => {
    beforeEach(() => {
      cy.kcFakeLogin('user', 'entities/match');
    });

    it('THEN it should display the correct breadcrumb', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('Match Entities');
    });

    describe('WHEN I type match request id and click match entities button', () => {
      it('THEN it should show dialog box with matching entities', () => {
        const response = {
          id: 'f04a88b5-5847-4282-8727-26b247f86308',
          name: 'MCNAMEE',
          dunsNumber: null,
          address: {
            line1: null,
            line2: null,
            city: null,
            region: null,
            country: 'AU',
            postalCode: null,
            regionName: 'Asia',
            postalCodeExtension: '2000',
            countryName: 'Australia',
          },
          status: 'REVIEW_REQUIRED',
          matchCandidates: [
            {
              entityId: null,
              id: 'c10d265a-29b8-45bd-87a1-2071e66d6264',
              name: 'The Trustee for THE MCNAMEE FAMILY TRUST',
              dunsNumber: '742115303',
              entityIds: null,
              primaryAddress: {
                line1: '175A SWANN RD',
                line2: null,
                city: 'TARINGA',
                region: null,
                country: 'AU',
                postalCode: '4068',
                regionName: 'Asia',
                postalCodeExtension: '2000',
                countryName: 'Australia',
              },
              matchScore: 95.0,
              status: 'ACTIVE',
            },
            {
              entityId: 'd3e54bc9-7198-4f0a-9535-b3d49c610968',
              id: 'b10d265a-29b8-45bd-87a1-2071e66d6266',
              name: 'MCNAMEE PTY LTD',
              dunsNumber: '750878824',
              entityIds: null,
              primaryAddress: {
                line1: '353 Indooroopilly Rd',
                line2: '',
                city: 'Indooroopilly',
                region: 'Asia Pacific',
                country: 'AU',
                postalCode: '4068',
                regionName: 'Asia',
                postalCodeExtension: '2000',
                countryName: 'Australia',
              },
              matchScore: 95.0,
              status: 'ACTIVE',
            },
          ],
        };

        cy.server();

        cy.route('GET', '/match-request/1234-abcd-1234', response).as('matchEntity');

        cy.get('[data-testid="match-request-id"]').type('1234-abcd-1234');

        cy.get('[data-testid="match-entities"]').click();

        cy.wait('@matchEntity').then((xhr) => {
          expect(xhr.url).to.contain('/match-request/1234-abcd-1234');
        });

        cy.get('[data-testid="number-of-matching-records"]').contains(
          '2 matching records found for',
        );
      });
    });
  });
});
