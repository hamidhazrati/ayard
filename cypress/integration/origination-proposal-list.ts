describe('List Origination Proposals', () => {
  before(() => {
    cy.fixture('origination-proposal/cashflow-file-start-origination.json').then(
      (data) => (this.CASHFLOW_FILE = data),
    );
    cy.fixture('origination-proposal/cashflow-summary.json').then(
      (data) => (this.CASHFLOW_SUMMARY = data),
    );
    cy.fixture('origination-proposal/cashflow-total.json').then(
      (data) => (this.CASHFLOW_TOTALS = data),
    );
    cy.fixture('origination-proposal/cashflow-file-facilities.json').then(
      (data) => (this.CASHFLOW_FILE_FACILITIES = data),
    );
  });

  const baseUrl = Cypress.config().baseUrl;

  beforeEach(() => {
    cy.server();

    cy.route(
      'GET',
      '/cashflow/cashflow-totals?state.not=INVALID&state.not=REJECTED&state.not=RECEIVED&state.not=VALIDATED&state.not=CASHFLOW_PROCESSING_ERROR',
      this.CASHFLOW_TOTALS,
    );

    cy.kcFakeLogin('user', `/cashflows/proposals`);
  });

  describe('GIVEN the list origination proposals page is visited', () => {
    it('THEN the correct breadcrumb should be displayed', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('Origination Proposals');
    });

    it('THEN the correct data should be in the list', () => {
      cy.get('[data-testid="cashflow-total-row-0"]').should('be.visible');
      cy.get('[data-testid="cashflow-total-row-1"]').should('be.visible');
      cy.get('[data-testid="cashflow-total-row-2"]').should('not.be.visible');

      cy.get('[data-testid="cashflow-total-row-0"] > [data-testid="cashflow-file-id"]').contains(
        this.CASHFLOW_TOTALS[0].cashflowFileId,
      );
      cy.get('[data-testid="cashflow-total-row-1"] > [data-testid="cashflow-file-id"]').contains(
        this.CASHFLOW_TOTALS[1].cashflowFileId,
      );

      cy.get('[data-testid="cashflow-total-row-0"] > [data-testid="contract-name"]').contains(
        this.CASHFLOW_TOTALS[0].contractName,
      );
      cy.get('[data-testid="cashflow-total-row-1"] > [data-testid="contract-name"]').contains(
        this.CASHFLOW_TOTALS[1].contractName,
      );

      cy.get('[data-testid="cashflow-total-row-0"] > [data-testid="currency"]').contains(
        this.CASHFLOW_TOTALS[0].currency,
      );
      cy.get('[data-testid="cashflow-total-row-1"] > [data-testid="currency"]').contains(
        this.CASHFLOW_TOTALS[1].currency,
      );
    });

    describe('WHEN a row is clicked', () => {
      beforeEach(() => {
        cy.route('GET', `/cashflowfiles/${this.CASHFLOW_FILE.id}`, this.CASHFLOW_FILE);
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
      });

      it('THEN the browser should navigate to the proposal and show the correct proposal tab for the file, contract and currency ', () => {
        cy.get('[data-testid="cashflow-total-row-1"').click();

        cy.url().should(
          'eq',
          `${baseUrl}/cashflows/files/${this.CASHFLOW_TOTALS[1].cashflowFileId}/proposals?contractId=${this.CASHFLOW_TOTALS[1].contractId}&currency=${this.CASHFLOW_TOTALS[1].currency}`,
        );

        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].currency);
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].contractName);
        cy.get('[data-testid="cashflow-totals-card"]').contains(
          `Payment Amount: ${this.CASHFLOW_TOTALS[1].currency} ${this.CASHFLOW_TOTALS[1].totalPaymentAmount}`,
        );
      });
    });
  });
});
