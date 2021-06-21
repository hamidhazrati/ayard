describe('Origination Proposal - Editing', () => {
  before(() => {
    cy.fixture('origination-proposal/cashflow-file-start-origination.json').then(
      (data) => (this.CASHFLOW_FILE = data),
    );
    cy.fixture('origination-proposal/cashflow-file-status-rejected.json').then(
      (data) => (this.REJECTED_CASHFLOW_FILE = data),
    );
    cy.fixture('origination-proposal/cashflow-file-status-awaiting-approval.json').then(
      (data) => (this.AWAITING_APPROVAL_CASHFLOW_FILE = data),
    );
    cy.fixture('origination-proposal/cashflow-file-status-start-origination.json').then(
      (data) => (this.START_ORIGINATION_CASHFLOW_FILE = data),
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
    cy.fixture('origination-proposal/cashflow-file-status-stt.json').then(
      (data) => (this.CASHFLOW_FILE_SUBMITTED_TO_TRADE = data),
    );
  });

  const baseUrl = Cypress.config().baseUrl;

  beforeEach(() => {
    cy.server();
    cy.route('GET', `/cashflowfiles/${this.CASHFLOW_FILE.id}`, this.CASHFLOW_FILE).as(
      'getCashflowfiles',
    );
    cy.route(
      'GET',
      `/cashflow/cashflow-summary?cashflowFileId=${this.CASHFLOW_FILE.id}&includeAllFailuresInFile=true&states.not=RECEIVED&states.not=VALIDATED`,
      this.CASHFLOW_SUMMARY,
    ).as('getCashflowSummary');
    cy.route(
      'GET',
      `/cashflow/cashflow-totals?cashflowFileId=${this.CASHFLOW_FILE.id}&state.not=INVALID&state.not=REJECTED&state.not=RECEIVED&state.not=VALIDATED&state.not=CASHFLOW_PROCESSING_ERROR`,
      this.CASHFLOW_TOTALS,
    ).as('getCashflowTotals');
    cy.route(
      'GET',
      `/cashflowfiles/${this.CASHFLOW_FILE.id}/cashflowfile-exposure`,
      this.CASHFLOW_FILE_FACILITIES,
    );
    cy.route('POST', '/cashflow/reject-batch', '200').as('rejectCashflows');

    cy.route(
      'GET',
      `/cashflowfiles/${this.CASHFLOW_FILE_SUBMITTED_TO_TRADE.id}`,
      this.CASHFLOW_FILE_SUBMITTED_TO_TRADE,
    ).as('getCashFlowSubmittedToTrade');
    cy.kcFakeLogin(
      'user',
      `/cashflows/files/${this.CASHFLOW_FILE.id}/proposals?contractId=${this.CASHFLOW_TOTALS[0].contractId}&currency=${this.CASHFLOW_TOTALS[0].currency}`,
    );
  });

  describe('GIVEN I want to edit the origination proposal', () => {
    beforeEach(() => {
      cy.server();
      cy.route(
        'GET',
        `/cashflowfiles/${this.AWAITING_APPROVAL_CASHFLOW_FILE.id}`,
        this.AWAITING_APPROVAL_CASHFLOW_FILE,
      ).as('getCashflowfiles');
    });
    describe('WHEN the Edit button is pressed', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.AWAITING_APPROVAL_CASHFLOW_FILE.id}`,
          this.AWAITING_APPROVAL_CASHFLOW_FILE,
        ).as('awaitingApprovalCashflowFileRequest');
      });
      it('THEN other tabs will become un-editable', () => {
        // Select both tabs
        cy.get('.mat-tab-label-content').first().click();
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[0].currency);
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[0].contractName);

        cy.get('.mat-tab-label-content').eq(1).click();
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].currency);
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].contractName);

        // then edit
        cy.get('[data-testid="edit"]').click();

        // cannot go back to other tab
        cy.get('.mat-tab-label-content').first().click();
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].currency);
        cy.get('.mat-tab-label-active').contains(this.CASHFLOW_TOTALS[1].contractName);
      });

      it('THEN the Accept column can be selected and the dialogue will appear', () => {
        cy.get('.mat-tab-label-content').first().click();
        cy.get('[data-testid="cashflow-row-0"]').click();

        cy.get('mat-checkbox').first().find('input').should('be.disabled');

        cy.get('[data-testid="edit"]').click();

        cy.get('mat-checkbox').first().find('input').should('not.be.disabled');
        cy.get('mat-checkbox').first().find('input').should('be.checked');
        cy.get('mat-checkbox').first().find('input').uncheck({ force: true });
      });

      it('THEN the save and cancel buttons will become visible', () => {
        cy.assertDomElementDoesNotExist('[data-testid="save"]');
        cy.assertDomElementDoesNotExist('[data-testid="cancel-edit"]');

        cy.get('[data-testid="edit"]').click();

        cy.assertDomElementExists('[data-testid="save"]');
        cy.assertDomElementExists('[data-testid="cancel-edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="export"]');
        cy.assertDomElementDoesNotExist('[data-testid="reject"]');
      });

      it('THEN pressing save will make the main buttons visible again', () => {
        cy.get('[data-testid="edit"]').click();

        cy.get('[data-testid="save"]').click();

        cy.assertDomElementDoesNotExist('[data-testid="save"]');
        cy.assertDomElementDoesNotExist('[data-testid="cancel-edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="export"]');
        cy.assertDomElementExists('[data-testid="edit"]');
        cy.assertDomElementExists('[data-testid="reject"]');
      });

      it('THEN pressing cancel will make the main buttons visible again', () => {
        cy.get('[data-testid="edit"]').click();

        cy.get('[data-testid="cancel-edit"]').click();

        cy.assertDomElementDoesNotExist('[data-testid="save"]');
        cy.assertDomElementDoesNotExist('[data-testid="cancel-edit"]');
        cy.assertDomElementExists('[data-testid="edit"]');
        cy.assertDomElementExists('[data-testid="reject"]');
        cy.assertDomElementDoesNotExist('[data-testid="export"]');
      });
    });

    describe('WHEN a cashflow is selected and then OK/Reject is selected from the dialogue window', () => {
      it('THEN it will call reject cashflows correctly', () => {
        cy.get('.mat-tab-label-content').first().click();
        cy.get('[data-testid="cashflow-row-0"]').click();

        cy.get('[data-testid="edit"]').click();

        cy.get('mat-checkbox').first().find('input').uncheck({ force: true });

        cy.get('[data-testid="unaccepted-cashflow-ok"]').click();

        cy.get('[data-testid="save"]').click();

        cy.wait('@rejectCashflows').its('url').should('include', '/cashflow/reject-batch');
      });
    });

    describe('WHEN a cashflow is selected and Cancel is selected from the dialogue window', () => {
      it('THEN it will return that cashflow to accepted ', () => {
        cy.get('.mat-tab-label-content').first().click();
        cy.get('[data-testid="cashflow-row-0"]').click();

        cy.get('[data-testid="edit"]').click();

        cy.get('mat-checkbox').first().find('input').uncheck({ force: true });

        cy.get('[data-testid="unaccepted-cashflow-cancel"]').click();

        cy.get('mat-checkbox').first().find('input').should('not.be.disabled');
        cy.get('mat-checkbox').first().find('input').should('be.checked');
      });
    });

    describe('WHEN an Origination Proposal is edited and then cancelled', () => {
      it('THEN it will not update the proposal', () => {
        cy.get('.mat-tab-label-content').first().click();
        cy.get('[data-testid="cashflow-row-0"]').click();

        cy.get('[data-testid="edit"]').click();

        cy.get('mat-checkbox').first().find('input').uncheck({ force: true });

        cy.get('[data-testid="unaccepted-cashflow-ok"]').click();

        cy.get('[data-testid="cancel-edit"]').click();

        cy.wait(['@getCashflowfiles', '@getCashflowSummary', '@getCashflowTotals']);

        cy.get('mat-checkbox').first().find('input').should('be.disabled');
        cy.get('mat-checkbox').first().find('input').should('be.checked');
        cy.get('div[data-testid="cashflow-tabs"] .mat-tab-label-active').contains(
          'Valid Cashflows (5)',
        );
        cy.assertDomElementExists('[data-testid="cashflow-row-0"]');
        cy.get('[data-testid="cashflow-row-0"] > [data-testid="cashflow-no-of-cf"]').contains(3);
        cy.assertDomElementExists('[data-testid="cashflow-row-1"]');
        cy.get('[data-testid="cashflow-row-1"] > [data-testid="cashflow-no-of-cf"]').contains(2);
        cy.assertDomElementDoesNotExist('[data-testid="cashflow-row-2"]');

        // expand the first row and check contents
        cy.get('[data-testid="cashflow-row-0"]').click();
        cy.assertDomElementExists('[data-testid="cashflow-nested-row-0"]');
        cy.assertDomElementExists('[data-testid="cashflow-nested-row-1"]');
        cy.assertDomElementExists('[data-testid="cashflow-nested-row-2"]');
        cy.assertDomElementDoesNotExist('[data-testid="cashflow-nested-row-3"]');
      });
    });

    describe('WHEN an Origination Proposal has a cashflow status of "submitted_to_trade"', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.CASHFLOW_FILE_SUBMITTED_TO_TRADE.id}`,
          this.CASHFLOW_FILE_SUBMITTED_TO_TRADE,
        ).as('getCashFlowSubmittedToTrade');
      });
      it('THEN it should show the valid tab as Accepted Cashflows and invalid tab as Rejected Cashflows', () => {
        cy.wait(['@getCashFlowSubmittedToTrade']);
        cy.contains('Accepted Cashflows').click();
        cy.contains('Rejected Cashflows').click();
      });
    });
  });
});
