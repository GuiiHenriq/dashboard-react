// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      
      /**
       * Custom command to fill login form and submit
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to perform quick login with valid credentials
       * @example cy.quickLogin()
       */
      quickLogin(): Chainable<void>
      
      /**
       * Custom command to verify form validation errors
       * @example cy.checkFormValidation('email', 'Please enter a valid email address')
       */
      checkFormValidation(field: string, expectedMessage: string): Chainable<void>
      
      /**
       * Custom command to clear form validation errors
       * @example cy.clearValidationErrors()
       */
      clearValidationErrors(): Chainable<void>
      
      /**
       * Custom command to wait for login page to load
       * @example cy.waitForLoginPage()
       */
      waitForLoginPage(): Chainable<void>
    }
  }
}

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`)
})

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get('#email').clear().type(email)
  cy.get('#password').clear().type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('quickLogin', () => {
  const validEmail = 'eve.holt@reqres.in'
  const validPassword = 'cityslicka'
  
  cy.get('#email').clear().type(validEmail)
  cy.get('#password').clear().type(validPassword)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard', { timeout: 15000 })
})

Cypress.Commands.add('checkFormValidation', (field: string, expectedMessage: string) => {
  cy.get(`#${field}`).should('have.class', 'border-red-300')
  cy.contains(expectedMessage).should('be.visible')
})

Cypress.Commands.add('clearValidationErrors', () => {
  cy.get('#email').clear().type('test@example.com')
  cy.get('#password').clear().type('password123')
  
  cy.get('#email').should('not.have.class', 'border-red-300')
  cy.get('#password').should('not.have.class', 'border-red-300')
})

Cypress.Commands.add('waitForLoginPage', () => {
  cy.contains('Welcome back').should('be.visible')
  cy.get('#email').should('be.visible')
  cy.get('#password').should('be.visible')
  cy.get('button[type="submit"]').should('be.visible')
})

export {}
