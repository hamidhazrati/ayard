import { Task } from '@app/features/exceptions/models/task.model';
import { Page } from '@app/shared/pagination';
import { EXCEPTIONS_PAGE } from '../fixtures/exceptions/tasks';

describe('Exceptions List', () => {
  const page: Page<Task> = EXCEPTIONS_PAGE;

  beforeEach(() => {
    cy.server();
    cy.route('GET', '/tasks?page=0&size=10&sort=createdDate,desc', page);
    cy.kcFakeLogin('user', 'exceptions');
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('GIVEN I visit Exceptions', () => {
    it('THEN Exception Tasks are displayed', () => {
      cy.get('[data-testid="sourceId"]').then((elem) => {
        const actualValues = elem.toArray().map((s) => s.innerText);
        expect(actualValues).to.eql([page.data[0].sourceId, page.data[1].sourceId]);
      });

      cy.get('[data-testid="type"]').then((elem) => {
        const actualValues = elem.toArray().map((s) => s.innerText);
        expect(actualValues).to.eql(['Max Tenor', 'Max Tenor']);
      });
    });
  });
});
