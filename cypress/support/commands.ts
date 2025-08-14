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
       * Custom command to login with email and password
       * @param email - User email
       * @param password - User password
       */
      login(email: string, password: string): Chainable<void>

      /**
       * Custom command to register a new user
       * @param userData - User registration data
       */
      register(userData: {
        firstName: string
        lastName: string
        email: string
        password: string
        confirmPassword: string
      }): Chainable<void>

      /**
       * Custom command to fill user form in modal
       * @param userData - User data to fill
       */
      fillUserForm(userData: {
        firstName: string
        lastName: string
        email: string
        job: string
      }): Chainable<void>

      /**
       * Custom command to wait for API request to complete
       * @param alias - The alias of the intercepted request
       */
      waitForApi(alias: string): Chainable<void>
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)
  cy.get('[data-cy="submit-button"]').click()
})

// Register command
Cypress.Commands.add('register', (userData) => {
  cy.visit('/auth/register')
  cy.get('[data-cy="firstName-input"]').type(userData.firstName)
  cy.get('[data-cy="lastName-input"]').type(userData.lastName)
  cy.get('[data-cy="email-input"]').type(userData.email)
  cy.get('[data-cy="password-input"]').type(userData.password)
  cy.get('[data-cy="confirmPassword-input"]').type(userData.confirmPassword)
  cy.get('[data-cy="submit-button"]').click()
})

// Fill user form command
Cypress.Commands.add('fillUserForm', (userData) => {
  cy.get('[data-cy="modal-firstName-input"]').clear().type(userData.firstName)
  cy.get('[data-cy="modal-lastName-input"]').clear().type(userData.lastName)
  cy.get('[data-cy="modal-email-input"]').clear().type(userData.email)
  cy.get('[data-cy="modal-job-input"]').clear().type(userData.job)
})

// Wait for API command
Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.wait(`@${alias}`).its('response.statusCode').should('be.oneOf', [200, 201])
})

export {}
