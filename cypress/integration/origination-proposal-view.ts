describe('Origination Proposal - View', () => {
  describe('GIVEN a cashflow', () => {
    before(() => {
      cy.fixture('origination-proposal/cashflow-file-start-origination.json').then(
        (data) => (this.CASHFLOW_FILE = data),
      );
      cy.fixture('origination-proposal/cashflow-summary.json').then(
        (data) => (this.CASHFLOW_SUMMARY = data),
      );
      cy.fixture('origination-proposal/cashflow-file-facilities.json').then(
        (data) => (this.CASHFLOW_FILE_FACILITIES = data),
      );
      cy.fixture('origination-proposal/cashflow-total.json').then(
        (data) => (this.CASHFLOW_TOTALS = data),
      );
    });

    const baseUrl = Cypress.config().baseUrl;

    beforeEach(() => {
      cy.server();
      cy.route({
        method: 'GET',
        url: `/cashflowfiles/${this.CASHFLOW_FILE.id}`,
        response: this.CASHFLOW_FILE,
        status: 200,
        delay: 1000,
      });

      cy.route(
        'GET',
        `/cashflow/cashflow-summary?cashflowFileId=${this.CASHFLOW_FILE.id}&includeAllFailuresInFile=true&states.not=RECEIVED&states.not=VALIDATED`,
        this.CASHFLOW_SUMMARY,
      );
      cy.route(
        'GET',
        `/cashflow/cashflow-totals?cashflowFileId=${this.CASHFLOW_FILE.id}&state.not=INVALID&state.not=REJECTED&state.not=RECEIVED&state.not=VALIDATED&state.not=CASHFLOW_PROCESSING_ERROR`,
        this.CASHFLOW_TOTALS,
      );
      cy.route(
        'GET',
        `/cashflowfiles/${this.CASHFLOW_FILE.id}/cashflowfile-exposure`,
        this.CASHFLOW_FILE_FACILITIES,
      );
      cy.kcFakeLogin(
        'user',
        `/cashflows/files/${this.CASHFLOW_FILE.id}/proposals?contractId=${this.CASHFLOW_TOTALS[0].contractId}&currency=${this.CASHFLOW_TOTALS[0].currency}`,
      );
    });

    describe('WHEN we visit the view origination proposal screen', () => {
      it('THEN a loading spinner should be displayed', () => {
        cy.get('.cdk-overlay-container mat-spinner').should('be.visible');
      });

      it('THEN it should display origination proposals with the correct breadcrumb', () => {
        cy.get('[data-testid="breadcrumbs"]').contains(`${this.CASHFLOW_FILE.id}`);
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Start Origination`);
      });

      it('THEN it should display the layout', () => {
        cy.get('[data-testid="header-card"]').should('be.visible');
        cy.get('[data-testid="contract-card"]').should('be.visible');
        cy.get('[data-testid="cashflow-totals-card"]').should('be.visible');
        cy.get('[data-testid="dates-card"]').should('be.visible');
      });

      describe('WHEN the first Contract/Currency Tab is selected', () => {
        it('THEN the correct tab and deep link is displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').first().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[0].currency);
          cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[0].contractName);

          cy.url().should(
            'eq',
            `${baseUrl}/cashflows/files/${this.CASHFLOW_TOTALS[0].cashflowFileId}/proposals?contractId=${this.CASHFLOW_TOTALS[0].contractId}&currency=${this.CASHFLOW_TOTALS[0].currency}`,
          );
        });

        it('THEN the correct totals are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').first().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('[data-testid="cashflow-totals-card"]').contains(
            `Payment Amount: ${this.CASHFLOW_TOTALS[0].currency} ${this.CASHFLOW_TOTALS[0].totalPaymentAmount}`,
          );
        });

        it('THEN the correct valid cashflows grouped by Account Debtor are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').first().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-active').contains(
            'Valid Cashflows (5)',
          );

          cy.assertDomElementExists('[data-testid="cashflow-row-0"]');
          cy.get('[data-testid="cashflow-row-0"] > [data-testid="cashflow-no-of-cf"]').contains(3);
          cy.get('[data-testid="cashflow-row-0"] > [data-testid="cashflow-ccy"]').contains(
            this.CASHFLOW_TOTALS[0].currency,
          );

          cy.assertDomElementExists('[data-testid="cashflow-row-1"]');
          cy.get('[data-testid="cashflow-row-1"] > [data-testid="cashflow-no-of-cf"]').contains(2);
          cy.get('[data-testid="cashflow-row-1"] > [data-testid="cashflow-ccy"]').contains(
            this.CASHFLOW_TOTALS[0].currency,
          );

          cy.assertDomElementDoesNotExist('[data-testid="cashflow-row-2"]');

          // expand the first row and check contents
          cy.get('[data-testid="cashflow-row-0"]').click();
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-0"]');
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-1"]');
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-2"]');
          cy.assertDomElementDoesNotExist('[data-testid="cashflow-nested-row-3"]');
        });

        it('THEN the invalid cashflows are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').first().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').last().click();

          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-active').contains(
            'Invalid Cashflows (3)',
          );

          cy.assertDomElementExists('[data-testid="cashflows-row-0"]');
          cy.assertDomElementExists('[data-testid="cashflows-row-1"]');
          cy.assertDomElementDoesNotExist('[data-testid="cashflow-row-2"]');
        });
      });

      describe('WHEN the Last Contract/Currency Tab is selected', () => {
        it('THEN the correct tab and deep link is displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').last().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].currency);
          cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].contractName);

          cy.url().should(
            'eq',
            `${baseUrl}/cashflows/files/${this.CASHFLOW_TOTALS[1].cashflowFileId}/proposals?contractId=${this.CASHFLOW_TOTALS[1].contractId}&currency=${this.CASHFLOW_TOTALS[1].currency}`,
          );
        });

        it('THEN the correct totals are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').last().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('[data-testid="cashflow-totals-card"]').contains(
            `Payment Amount: ${this.CASHFLOW_TOTALS[1].currency} ${this.CASHFLOW_TOTALS[1].totalPaymentAmount}`,
          );
        });

        it('THEN the correct valid cashflows grouped by Account Debtor are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').last().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').first().click();

          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-active').contains(
            'Valid Cashflows (3)',
          );

          cy.assertDomElementExists('[data-testid="cashflow-row-0"]');
          cy.get('[data-testid="cashflow-row-0"] > [data-testid="cashflow-no-of-cf"]').contains(3);
          cy.get('[data-testid="cashflow-row-0"] > [data-testid="cashflow-ccy"]').contains(
            this.CASHFLOW_TOTALS[1].currency,
          );

          cy.assertDomElementDoesNotExist('[data-testid="cashflow-row-1"]');

          // expand the first row and check contents
          cy.get('[data-testid="cashflow-row-0"]').click();
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-0"]');
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-1"]');
          cy.assertDomElementExists('[data-testid="cashflow-nested-row-2"]');
          cy.assertDomElementDoesNotExist('[data-testid="cashflow-nested-row-3"]');
        });

        it('THEN the invalid cashflows are displayed', () => {
          cy.get('.mat-tab-label-content .proposal-tab').last().click();
          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-content').last().click();

          cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-active').contains(
            'Invalid Cashflows (3)',
          );

          cy.assertDomElementExists('[data-testid="cashflows-row-0"]');
          cy.assertDomElementDoesNotExist('[data-testid="cashflow-row-1"]');
        });
      });
    });
  });
});
