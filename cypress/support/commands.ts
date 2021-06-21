// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-keycloak-commands';

Cypress.Commands.add('selectDropdown', (selector, value) => {
  cy.get(`[data-testid="${selector}"]`)
    .click()
    .then(() => {
      cy.get(`[data-testid="${selector}-option"`).contains(value).click();
      cy.get(`[data-testid="${selector}-option"`).should('be.hidden');
    });
});

Cypress.Commands.add('equalsTrimmed', (selector, value) => {
  cy.get(`[data-testid="${selector}"]`).should(($el) => {
    expect($el.text().trim()).equal(value ? `${value}` : '');
  });
});

Cypress.Commands.add('uploadFile', (fileName, fileType = '', selector) => {
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then((blob) => {
        const el = subject[0];
        const testFile = new File([blob], fileName, { type: fileType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;

        cy.get(selector).trigger('change', { force: true });
      });
  });
});

// Encapsulates the confusing syntax in cypress to do negative DOM assertions
// properly without getting a false positive
// https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Default-Assertions
Cypress.Commands.add('assertDomElementDoesNotExist', (selector) => {
  cy.get(selector).should('not.be.visible').should('not.exist');
});
Cypress.Commands.add('assertDomElementExists', (selector) => {
  cy.get(selector);
});

// tslint:disable-next-line:no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    selectDropdown(selector: string, value: string): Chainable<Subject>;
    equalsTrimmed(selector: string, value: any): Chainable<Subject>;
    uploadFile(fileName: string, fileType: string, selector: string);
    assertDomElementDoesNotExist(selector: string);
    assertDomElementExists(selector: string);
  }
}
