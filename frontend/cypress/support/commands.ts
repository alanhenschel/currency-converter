// cypress/support/commands.ts

/// <reference types="cypress" />

// cypress/support/commands.ts

/// <reference types="cypress" />

// Mock API responses for testing
Cypress.Commands.add('mockApiResponses', () => {
  // Mock successful conversion
  cy.intercept('POST', '**/api/v1/conversion', {
    statusCode: 200,
    body: {
      transaction_id: 1,
      user_id: 123,
      from_currency: 'USD',
      to_currency: 'BRL',
      from_value: 100,
      to_value: 520.50,
      rate: 5.205,
      timestamp: '2024-01-15T10:30:00Z'
    }
  }).as('convertCurrency')

  // Mock transaction history
  cy.intercept('GET', '**/api/v1/transactions*', {
    statusCode: 200,
    body: [
      {
        transaction_id: 1,
        user_id: 123,
        from_currency: 'USD',
        to_currency: 'BRL',
        from_value: 100,
        to_value: 520.50,
        rate: 5.205,
        timestamp: '2024-01-15T10:30:00Z'
      }
    ]
  }).as('getTransactions')
})

// Fill conversion form helper
Cypress.Commands.add('fillConversionForm', (data: {
  fromCurrency: string
  toCurrency: string
  amount: string
  userId: string
}) => {
  cy.get('[data-cy=from-currency]').select(data.fromCurrency)
  cy.get('[data-cy=to-currency]').select(data.toCurrency)
  cy.get('[data-cy=amount-input]').clear().type(data.amount)
  cy.get('[data-cy=user-id-input]').clear().type(data.userId)
})

declare global {
  namespace Cypress {
    interface Chainable {
      mockApiResponses(): Chainable<void>
      fillConversionForm(data: {
        fromCurrency: string
        toCurrency: string
        amount: string
        userId: string
      }): Chainable<void>
    }
  }
}
