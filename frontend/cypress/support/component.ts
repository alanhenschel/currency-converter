// cypress/support/component.ts

// Import commands.js using ES2015 syntax:
import './commands'

// Import global styles
import '../../src/index.css'

// Component testing support
import { mount } from 'cypress/react18'

// Extend Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)
