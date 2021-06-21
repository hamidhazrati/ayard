import { Task } from '@app/features/exceptions/models/task.model';
import { Page } from '@app/shared/pagination';
import { EXCEPTIONS_PAGE } from '../fixtures/exceptions/tasks';

describe('Exception Override', () => {
  const page: Page<Task> = EXCEPTIONS_PAGE;

  beforeEach(() => {
    cy.server();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('GIVEN I visit Exceptions', () => {
    it('THEN I am able to override an exception', () => {
      cy.kcFakeLogin('user', 'exceptions');
      cy.route('GET', '/tasks?page=0&size=10&sort=createdDate,desc', page);
      cy.get('.datatable-body-row').eq(0).click();

      cy.get('[data-testid="release"]').should('be.visible');
      cy.get('[data-testid="reject"]').should('be.disabled');
      cy.get('[data-testid="override"]').should('be.visible');
      cy.get('[data-testid="cancel"]').should('be.visible');

      cy.route('POST', '/tasks/change-status', {}).as('updateStatus');

      cy.get('[data-testid="override"]').click();
      cy.get('[data-testid="reason"]').type('valid reason to override');
      cy.get('[data-testid="confirm"]').click();

      cy.wait('@updateStatus').then((xhr) => {
        const expectedRequest = {
          taskIds: ['1234'],
          reason: 'valid reason to override',
          status: 'IN_REVIEW_OVERRIDE',
        };

        expect(xhr.request.body).to.eql(expectedRequest);
      });
    });

    it('THEN I am able to see the updated override status of the exception', () => {
      cy.kcFakeLogin('user', 'exceptions');
      page.data[0].statusInfo.status = 'IN_REVIEW_OVERRIDE';
      page.data[0].statusInfo.updatedBy = 'testuser';
      page.data[0].statusInfo.reason = 'valid reason to override';
      cy.route('GET', '/tasks?page=0&size=10&sort=createdDate,desc', page);
      cy.get('.datatable-body-row')
        .eq(0)
        .get('[data-testid="statusInfo.status"]')
        .contains('In Review Override');
    });

    it('THEN I am able to confirm the exception override', () => {
      cy.kcFakeLogin('different-user', 'exceptions');
      cy.route('GET', '/tasks?page=0&size=10&sort=createdDate,desc', page);

      cy.get('.datatable-body-row').eq(0).click();

      cy.get('[data-testid="checker-confirm"]').should('be.visible');
      cy.get('[data-testid="checker-reject"]').should('be.visible');
      cy.get('[data-testid="cancel"]').should('be.visible');

      cy.route('POST', '/tasks/change-status', {}).as('updateStatus');

      cy.get('[data-testid="checker-confirm"]').click();
      cy.get('[data-testid="reason"]').type('confirm override by checker');
      cy.get('[data-testid="confirm"]').click();

      cy.wait('@updateStatus').then((xhr) => {
        const expectedRequest = {
          taskIds: ['1234'],
          reason: 'confirm override by checker',
        };
        expect(xhr.request.body).to.eql(expectedRequest);
      });
    });
  });
});
