describe('Origination Proposal - Different States', () => {
  describe('GIVEN a cashflow', () => {
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
      cy.fixture('origination-proposal/cashflow-file-awaiting-client-proposal.json').then(
        (data) => (this.CASHFLOW_FILE_AWAITING_CLIENT_PROPOSAL = data),
      );
      cy.fixture('origination-proposal/cashflow-file-finance-accepted.json').then(
        (data) => (this.CASHFLOW_FILE_FINANCE_ACCEPTED = data),
      );
      cy.fixture('origination-proposal/cashflow-file-pending-client-verification.json').then(
        (data) => (this.CASHFLOW_FILE_PENDING_CLIENT_VERIFICATION = data),
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
      cy.kcFakeLogin(
        'user',
        `/cashflows/files/${this.CASHFLOW_FILE.id}/proposals?contractId=${this.CASHFLOW_TOTALS[0].contractId}&currency=${this.CASHFLOW_TOTALS[0].currency}`,
      );
    });

    describe('WHEN cashflow file status is AWAITING_CLIENT_APPROVAL', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.CASHFLOW_FILE_AWAITING_CLIENT_PROPOSAL.id}`,
          this.CASHFLOW_FILE_AWAITING_CLIENT_PROPOSAL,
        );
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Awaiting Client Approval`);
      });

      it('THEN the correct buttons should be available', () => {
        cy.assertDomElementExists('[data-testid="export"]');
        cy.assertDomElementExists('[data-testid="submit-to-trade"]');

        cy.assertDomElementDoesNotExist('[data-testid="edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="reject"]');
        cy.assertDomElementDoesNotExist('[data-testid="grant-approval"]');
      });
    });

    describe('WHEN cashflow with status of REJECT is loaded', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.REJECTED_CASHFLOW_FILE.id}`,
          this.REJECTED_CASHFLOW_FILE,
        ).as('rejectedCashflowFileRequest');
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Reject`);
      });

      it('THEN the reject banner should be displayed', () => {
        const rejectionTime = cy.get('[data-testid="reject-user-time"]');
        rejectionTime.contains(this.REJECTED_CASHFLOW_FILE.rejectionDetail.user);
        rejectionTime.contains(this.REJECTED_CASHFLOW_FILE.rejectionDetail.date);

        const rejectionMessage = cy.get('[data-testid="reject-message"]');
        rejectionMessage.contains(this.REJECTED_CASHFLOW_FILE.rejectionDetail.message);
      });

      it('THEN the correct buttons should be available', () => {
        cy.assertDomElementDoesNotExist('[data-testid="edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="export"]');
        cy.assertDomElementDoesNotExist('[data-testid="submit-trade"]');
        cy.assertDomElementDoesNotExist('[data-testid="reject"]');
        cy.assertDomElementDoesNotExist('[data-testid="grant-approval"]');
      });
    });

    describe('GIVEN cashflow with status AWAITING_INTERNAL_APPROVAL', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.AWAITING_APPROVAL_CASHFLOW_FILE.id}`,
          this.AWAITING_APPROVAL_CASHFLOW_FILE,
        ).as('awaitingApprovalCashflowFileRequest');
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Awaiting Internal Approval`);
      });

      it('THEN the correct buttons should be available', () => {
        cy.assertDomElementExists('[data-testid="grant-approval"]');
        cy.assertDomElementExists('[data-testid="reject"]');
        cy.assertDomElementExists('[data-testid="edit"]');

        cy.assertDomElementDoesNotExist('[data-testid="export"]');
        cy.assertDomElementDoesNotExist('[data-testid="submit-to-trade"]');
      });

      describe('WHEN reject file button is pressed', () => {
        it('THEN the reject dialog should be opened', () => {
          cy.wait('@awaitingApprovalCashflowFileRequest');
          cy.get('[data-testid="reject"]').click();

          cy.assertDomElementExists('[data-testid="rejectFile"]');
          cy.get('[data-testid="cancel"]').click();
        });
      });
    });

    describe('GIVEN cashflow with status START_ORIGINATION', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.START_ORIGINATION_CASHFLOW_FILE.id}`,
          this.START_ORIGINATION_CASHFLOW_FILE,
        ).as('approvedInternallyCashflowFileRequest');
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Start Origination`);
      });

      it('THEN the correct buttons should be available', () => {
        cy.assertDomElementExists('[data-testid="reject"]');
        cy.assertDomElementExists('[data-testid="export"]');

        cy.assertDomElementDoesNotExist('[data-testid="submit-trade"]');
        cy.assertDomElementDoesNotExist('[data-testid="grant-approval"]');
        cy.assertDomElementDoesNotExist('[data-testid="edit"]');
      });

      describe('WHEN reject file button is pressed', () => {
        it('THEN the reject dialog should be opened', () => {
          cy.wait('@approvedInternallyCashflowFileRequest');
          cy.get('[data-testid="reject"]').click();

          cy.assertDomElementExists('[data-testid="rejectFile"]');
          cy.get('[data-testid="cancel"]').click();
        });
      });
    });

    describe('WHEN cashflow file status is PENDING_CLIENT_VERIFICATION', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          `/cashflowfiles/${this.CASHFLOW_FILE_PENDING_CLIENT_VERIFICATION.id}`,
          this.CASHFLOW_FILE_PENDING_CLIENT_VERIFICATION,
        );
      });

      it('THEN the status should be correct', () => {
        cy.get('[data-testid="status"]').contains(`Pending Client Verification`);
      });

      it('THEN the correct buttons should be available', () => {
        cy.assertDomElementExists('[data-testid="submit-to-trade"]');
        cy.assertDomElementExists('[data-testid="reject"]');

        cy.assertDomElementDoesNotExist('[data-testid="edit"]');
        cy.assertDomElementDoesNotExist('[data-testid="export"]');
        cy.assertDomElementDoesNotExist('[data-testid="grant-approval"]');
      });

      describe('WHEN the submit to trade button is clicked', () => {
        const clientAcceptanceLetter = 'origination-proposal/client-acceptance-letter.pdf';
        const clientAcceptanceLetterFileType = 'application/pdf';

        const proposalFile = 'origination-proposal/proposal.xlsx';
        const proposalFileType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        beforeEach(() => {
          cy.route(
            'POST',
            `/cashflowfiles/${this.CASHFLOW_FILE_FINANCE_ACCEPTED.id}/submit-to-trade`,
            this.CASHFLOW_FILE_FINANCE_ACCEPTED,
          ).as('uploadOk');
        });

        it('THEN the files can be uploaded', () => {
          cy.get('[data-testid="submit-to-trade"]').click();

          cy.get('[data-testid="proposal-file-label"]').contains(
            `Upload latest system generated proposal file (${this.CASHFLOW_FILE_FINANCE_ACCEPTED.exports[1].filename})`,
          );

          cy.uploadFile(
            clientAcceptanceLetter,
            clientAcceptanceLetterFileType,
            '[data-testid="client-request-letter-upload"]',
          );

          cy.uploadFile(proposalFile, proposalFileType, '[data-testid="proposal-file-upload"]');

          cy.get('[data-testid="upload"]').click();

          cy.wait(['@uploadOk']);

          cy.get('mat-dialog-container').should('not.be.visible').should('not.exist');

          cy.get('[data-testid="status"]').contains('Finance Accepted');

          cy.assertDomElementDoesNotExist('[data-testid="edit"]');
          cy.assertDomElementDoesNotExist('[data-testid="export"]');
          cy.assertDomElementDoesNotExist('[data-testid="submit-to-trade"]');
        });
      });
    });
  });
});
