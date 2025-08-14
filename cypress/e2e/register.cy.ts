/// <reference types="cypress" />

describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/auth/register')
    cy.waitForRegisterPage()
  })

  it('should load the register page correctly', () => {
    cy.contains('Create account').should('be.visible')
    cy.get('#firstName').should('be.visible')
    cy.get('#lastName').should('be.visible')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#confirmPassword').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should allow user to type in all form fields', () => {
    cy.fixture('registerData').then((registerData) => {
      cy.get('#firstName')
        .type(registerData.validCredentials.firstName)
        .should('have.value', registerData.validCredentials.firstName)
      
      cy.get('#lastName')
        .type(registerData.validCredentials.lastName)
        .should('have.value', registerData.validCredentials.lastName)
      
      cy.get('#email')
        .type(registerData.validCredentials.email)
        .should('have.value', registerData.validCredentials.email)
      
      cy.get('#password')
        .type(registerData.validCredentials.password)
        .should('have.value', registerData.validCredentials.password)
      
      cy.get('#confirmPassword')
        .type(registerData.validCredentials.confirmPassword)
        .should('have.value', registerData.validCredentials.confirmPassword)
    })
  })

  it('should redirect to dashboard after successful registration', () => {
    cy.fixture('registerData').then((registerData) => {
      cy.register(
        registerData.validCredentials.firstName,
        registerData.validCredentials.lastName,
        registerData.validCredentials.email,
        registerData.validCredentials.password,
        registerData.validCredentials.confirmPassword
      )
      cy.url().should('include', '/dashboard')
    })
  })
})
