// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import cypress code-coverage collector plugin
import '@cypress/code-coverage/support';
import { SHOULD_SHOWN_HELP_INTRO_KEY } from '../../src/app/features/help/components/help-intro-modal/should-show-help-intro-key.constant';

Cypress.on('test:before:run', () => {
  localStorage.setItem(SHOULD_SHOWN_HELP_INTRO_KEY, 'false');
});
