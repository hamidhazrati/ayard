describe('Cashflow File', () => {
  const fileName = 'A test cashflow file.xlsx';
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const clients = ['Katerra Inc'];

  const uploadCashflowFileResponse = {
    id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    clientName: 'Katerra Inc',
    filename: 'A test cashflow file.xlsx',
    uploadDate: '2020-07-08T12:59:08.029821Z',
    uploadedBy: 'Operations Portal',
    cashflowRowCount: null,
    status: 'PENDING_PROCESSING',
  };

  const cashflowfile = {
    id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    clientName: 'Katerra Inc',
    filename: 'A test cashflow file.xlsx',
    uploadDate: '2020-07-08T12:59:08.029821Z',
    uploadedBy: 'Operations Portal',
    status: 'END_PROCESSING',
    cashflowRowCount: 10,
    cashflowTotals: [
      {
        cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
        currency: 'GBP',
        totalOriginalValue: 1100.0,
        totalInitialFundingAmount: 190.0,
        totalCashflows: 110,
        totalValidCashflows: 180,
        totalInvalidCashflows: 120,
        totalInvalidOriginalValue: 120.0,
        totalInvalidInitialFundingAmount: 118.0,
      },
      {
        cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
        currency: 'USD',
        totalOriginalValue: 100.0,
        totalInitialFundingAmount: 90.0,
        totalCashflows: 10,
        totalValidCashflows: 8,
        totalInvalidCashflows: 2,
        totalInvalidOriginalValue: 20.0,
        totalInvalidInitialFundingAmount: 18.0,
      },
    ],
    processingFailureMessages: null,
  };

  const cashflowfileWithoutTotals = {
    id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
    clientName: 'Katerra Inc',
    filename: 'A test cashflow file.xlsx',
    uploadDate: '2020-07-08T12:59:08.029821Z',
    uploadedBy: 'Operations Portal',
    status: 'END_PROCESSING',
    cashflowRowCount: 10,
    processingFailureMessages: null,
  };

  const cashflowfiles = [
    {
      id: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      clientName: 'Katerra Inc',
      filename: 'A test cashflow file.xlsx',
      uploadDate: '2020-07-08T12:59:08.029821Z',
      uploadedBy: 'Operations Portal',
      status: 'PENDING_PROCESSING',
      cashflowRowCount: 10,
    },
    {
      id: 'b1e400e5-a512-437e-8cf1-422bc083xs34',
      clientName: 'Another Client',
      filename: 'Another cashflow file.xlsx',
      uploadDate: '2020-07-08T12:59:08.029821Z',
      uploadedBy: 'Operations Portal',
      status: 'PENDING_PROCESSING',
      cashflowRowCount: 10,
    },
  ];

  const page = {
    data: cashflowfiles,
    meta: {
      paged: {
        size: 1,
        page: 0,
        totalPages: 1,
        pageSize: 10,
        totalSize: 1,
      },
    },
  };

  const cashflows = [
    {
      id: 'abc-1',
      cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      entityOne: {
        id: '123abc',
        name: 'Entity One',
        role: 'Seller',
      },
      entityTwo: {
        id: '456def',
        name: 'Entity Two',
        role: 'Account Debtor',
      },
      contract: {
        id: 'the-contract-id1',
        name: 'Katerra Inc AR whole portfolio',
      },
      issueDate: '2020-05-09',
      originalDueDate: '2020-05-10',
      currency: 'GBP',
      originalValue: 1000.0,
      state: 'PENDING_PROCESSING',
      unitPrice: 123.34,
      certifiedAmount: 123.34,
      documentReference: 'ABCD0001',
      fundingAmount: 900.0,
      advanceRate: 90,
      maturityDate: '2020-10-23',
      reasonForFailure: [],
    },
    {
      id: 'abc-2',
      cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      entityOne: {
        id: '123abc',
        name: 'Entity One',
        role: 'Seller',
      },
      entityTwo: {
        id: '789ghi',
        name: 'Entity Three',
        role: 'Account Debtor',
      },
      contract: {
        id: 'the-contract-id2',
        name: 'Katerra Inc future receivable (full recourse)',
      },
      issueDate: '2020-05-09',
      originalDueDate: '2020-05-10',
      currency: 'GBP',
      originalValue: 9999.0,
      state: 'APPROVED',
      unitPrice: 123.34,
      certifiedAmount: 123.34,
      documentReference: 'ABCD0002',
      fundingAmount: 900.0,
      advanceRate: 90,
      maturityDate: '2020-10-23',
      reasonForFailure: [],
    },
    {
      id: 'abc-3',
      cashflowFileId: 'b1e400e5-a512-437e-8cf1-422bc083b175',
      entityOne: {
        id: '123abc',
        name: 'Entity One',
        role: 'Seller',
      },
      entityTwo: {
        id: '789ghi',
        name: 'Entity Three',
        role: 'Account Debtor',
      },
      contract: {
        id: 'the-contract-id1',
        name: 'Katerra Inc AR whole portfolio',
      },
      issueDate: '2020-05-09',
      originalDueDate: '2020-05-10',
      currency: 'USD',
      originalValue: 8888.0,
      state: 'REJECTED',
      rejectionDetail: {
        user: 'ops-portal-user',
        message: 'Too many cashflow failures',
        date: '2020-08-07 12:38:46',
      },
      unitPrice: 123.34,
      certifiedAmount: 123.34,
      documentReference: 'ABCD0002',
      fundingAmount: 900.0,
      advanceRate: 90,
      maturityDate: '2020-10-23',
      reasonForFailure: [
        {
          code: 'SINGLE_SUPPLIER',
          message: 'Must be one and only one supplier on the cashflow',
        },
        {
          code: 'SUPPLIER_NOT_ON_CONTRACT',
          message: 'The SUPPLIER is not on the Contract',
        },
      ],
    },
  ];

  beforeEach(() => {
    cy.server();

    cy.route('GET', '/cashflowfiles?page=0&size=10&sort=uploadDate,desc', page);
    cy.route('GET', '/contract-counterparty/seller', clients);
    cy.route(
      'GET',
      '/cashflow/cashflow-summary?cashflowFileId=b1e400e5-a512-437e-8cf1-422bc083b175&includeAllFailuresInFile=true',
      cashflows,
    );

    cy.kcFakeLogin('user', 'cashflows/files');
  });

  describe('GIVEN there are no valid cashflows', () => {
    beforeEach(() => {
      const resCFFile = { ...cashflowfile };
      resCFFile.status = 'CASHFLOW_CREATION_END';

      cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
      cy.route(
        'GET',
        '/cashflow/cashflow-summary?cashflowFileId=b1e400e5-a512-437e-8cf1-422bc083b175&includeAllFailuresInFile=true',
        [cashflows[2]],
      );
    });

    it('THEN the `Submit to origination proposal` button should be disabled', () => {
      cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();
      cy.get('[data-testid="submit-proposal"]').should('be.disabled');
    });
  });

  describe('GIVEN I want to view cashflows', () => {
    beforeEach(() => {
      cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', cashflowfile);
    });

    it('THEN it should display List Cashflows with the correct breadcrumb ', () => {
      cy.get('[data-testid="breadcrumbs"]').contains('Cashflow Files');
    });

    it('THEN I can click a row in the cashflow files list to view the cashflow file record', () => {
      cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

      cy.url().should('include', '/cashflows/files/b1e400e5-a512-437e-8cf1-422bc083b175');

      cy.get('[data-testid="breadcrumbs"]').contains('b1e400e5-a512-437e-8cf1-422bc083b175');

      cy.get('[data-testid="submit-processing"]').should('be.visible');
      cy.get('[data-testid="cashflow-file-card"]').should('be.visible');

      cy.get('[data-testid="submit-proposal"]').should('not.be.visible');
      cy.get('[data-testid="cashflows-card-submitted"]').should('not.be.visible');
      cy.get('[data-testid="contract-card"]').should('not.be.visible');
      cy.get('[data-testid="cashflows-table-card"]').should('not.be.visible');
    });

    describe('GIVEN I submit the cashflow for processing', () => {
      beforeEach(() => {
        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('POST', `/cashflowfiles/${cashflowfile.id}/processing-status`, resCFFile).as(
          'statusUpdate',
        );
      });
      it('THEN it should show the submitted view of the cashflow', () => {
        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('[data-testid="submit-proposal"]').should('be.visible');
        cy.get('[data-testid="cashflow-file-card"]').should('be.visible');
        cy.get('[data-testid="cashflows-card-submitted"]').should('be.visible');
        cy.get('[data-testid="contract-card"]').should('be.visible');
        cy.get('[data-testid="cashflows-table-card"]').should('be.visible');
      });

      it('THEN it should show the the valid cashflows', () => {
        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('.mat-tab-label-content').first().click(); // Valid Cashflows Tab

        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(0).should('be.visible');
        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(1).should('be.visible');
        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(2).should('not.be.visible');
      });

      it('THEN it should show the the invalid cashflows', () => {
        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('.mat-tab-label-content').last().click(); // Invalid Cashflows Tab

        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(0).should('be.visible');
        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(1).should('not.be.visible');
      });
    });

    describe('GIVEN the cashflow has no totals', () => {
      beforeEach(() => {
        cy.route(
          'GET',
          '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175',
          cashflowfileWithoutTotals,
        );
        cy.route(
          'GET',
          '/cashflow/cashflow-summary?cashflowFileId=b1e400e5-a512-437e-8cf1-422bc083b175',
          cashflows,
        );
        const resCFFile = { ...cashflowfileWithoutTotals };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('POST', `/cashflowfiles/${cashflowfile.id}/processing-status`, resCFFile).as(
          'statusUpdate',
        );
      });

      it('THEN it should still show the submitted view of the cashflow OK', () => {
        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        cy.url().should('include', '/cashflows/files/b1e400e5-a512-437e-8cf1-422bc083b175');

        const resCFFile = { ...cashflowfileWithoutTotals };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('[data-testid="cashflows-card-submitted"]').should('be.visible');

        cy.get('.mat-tab-label-content').first().click(); // Valid Cashflows Tab

        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(0).should('be.visible');
        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(1).should('be.visible');
        cy.get('[data-testid="gds-data-table"] .datatable-body-row').eq(2).should('not.be.visible');
      });
    });

    describe('GIVEN I submit the cashflow for origination proposal', () => {
      it('THEN a request should be made to set state to START_ORIGINATION', () => {
        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('POST', `/cashflowfiles/${cashflowfile.id}/processing-status`, resCFFile).as(
          'statusUpdate',
        );

        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('[data-testid="confirm-proposal"]').should('not.be.visible');

        cy.get('[data-testid="submit-proposal"]').click();

        cy.get('[data-testid="confirm-proposal"]').should('be.visible');

        cy.get('[data-testid="confirm-proposal"]').click();

        cy.wait('@statusUpdate');

        cy.get('[data-testid="confirm-proposal"]').should('not.be.visible');
      });
    });

    describe('GIVEN I cancel the cashflow for origination proposal', () => {
      beforeEach(() => {
        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('POST', `/cashflowfiles/${cashflowfile.id}/processing-status`, resCFFile).as(
          'statusUpdate',
        );
      });
      it('THEN a request should not be made to set state to START_ORIGINATION', () => {
        cy.get('[data-testid="gds-data-table"').get('.datatable-body-row').click();

        const resCFFile = { ...cashflowfile };
        resCFFile.status = 'CASHFLOW_CREATION_END';
        cy.route('GET', '/cashflowfiles/b1e400e5-a512-437e-8cf1-422bc083b175', resCFFile);
        cy.get('[data-testid="submit-processing"]').click();

        cy.get('[data-testid="confirm-proposal"]').should('not.be.visible');

        cy.get('[data-testid="submit-proposal"]').click();

        cy.get('[data-testid="confirm-proposal"]').should('be.visible');

        cy.get('[data-testid="cancel-proposal"]').click();

        cy.get('[data-testid="cancel-proposal"]').should('not.be.visible');
      });
    });
  });

  describe('Upload Cashflow File', () => {
    describe('Given I select a client and a file and press upload', () => {
      describe('WHEN the response is OK', () => {
        it('THEN I can upload a file and show a Upload Successful message', () => {
          // Upload API returns 200
          cy.route('POST', '/cashflowfiles', uploadCashflowFileResponse).as('postOK');

          cy.get('[data-testid="upload-cashflow"]').click();

          cy.get('[data-testid="client"]')
            .click()
            .get('mat-option')
            .contains('Katerra Inc')
            .click();

          cy.uploadFile(fileName, fileType, '[data-testid="file-upload"]');

          cy.get('[data-testid="upload"]').should('not.be.disabled');

          cy.get('[data-testid="upload"]').click();

          cy.wait(['@postOK']);

          cy.get('[data-testid="upload__success"]').should('be.visible');
          cy.get('[data-testid="upload__failed"]').should('not.be.visible');

          cy.get('[data-testid="done"]').click();
        });
      });

      describe('WHEN the response is NOT OK', () => {
        it('THEN I can show a Upload Failed message', () => {
          // Upload API returns 400
          cy.server({
            status: 400,
            response: {},
          });
          cy.route('POST', '/cashflowfiles').as('postError');

          cy.get('[data-testid="upload-cashflow"]').click();

          cy.get('[data-testid="client"]')
            .click()
            .get('mat-option')
            .contains('Katerra Inc')
            .click();

          cy.uploadFile(fileName, fileType, '[data-testid="file-upload"]');

          cy.get('[data-testid="upload"]').should('not.be.disabled');

          cy.get('[data-testid="upload"]').click();

          cy.wait(['@postError']);

          cy.get('[data-testid="upload__failed"]').should('be.visible');
          cy.get('[data-testid="upload__success"]').should('not.be.visible');

          cy.get('[data-testid="done"]').click();
        });
      });
    });

    describe('WHEN I do not select a client', () => {
      it('THEN the upload button is disabled ', () => {
        cy.get('[data-testid="upload-cashflow"]').click();

        cy.uploadFile(fileName, fileType, '[data-testid="file-upload"]');

        cy.get('[data-testid="upload"]').should('be.disabled');

        cy.get('[data-testid="close"]').click();
      });
    });

    describe('WHEN I do not select a file', () => {
      it('THEN the upload button is disabled', () => {
        cy.get('[data-testid="upload-cashflow"]').click();

        cy.get('[data-testid="client"]').click().get('mat-option').contains('Katerra Inc').click();

        cy.get('[data-testid="upload"]').should('be.disabled');

        cy.get('[data-testid="close"]').click();
      });
    });

    describe('GIVEN I have clicked on "Upload Cashflow File"', () => {
      it('THEN the button should be disabled', () => {
        // Upload API returns 201 with body
        cy.route({
          method: 'POST',
          url: '/cashflowfiles',
          status: 201,
          response: uploadCashflowFileResponse,
          delay: 1000,
        });

        // click on "Upload new cashflow file"
        cy.get('[data-testid="upload-cashflow"]').click();

        // select client from the dropdown
        cy.get('[data-testid="client"]').click().get('mat-option').contains('Katerra Inc').click();

        // upload the dummy file
        cy.uploadFile(fileName, fileType, '[data-testid="file-upload"]');
        cy.get('[data-testid="upload"]').click();
        cy.get('[data-testid="upload"]').should('be.disabled');
      });
    });

    describe('GIVEN the `Upload new cashflow file` button has been pressed', () => {
      it('THEN the button should be disabled whilst counter parties are being fetched', () => {
        cy.route({
          method: 'GET',
          url: '/contract-counterparty/seller',
          status: 200,
          response: [],
          delay: 1000,
        });

        cy.get('[data-testid="upload-cashflow"]').click();
        cy.get('[data-testid="upload-cashflow"]').should('be.disabled');
      });
    });
  });
});
