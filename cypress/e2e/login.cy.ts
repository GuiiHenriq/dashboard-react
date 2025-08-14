/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
    cy.waitForLoginPage()
  })

  it('should load the login page correctly', () => {
    cy.contains('Welcome back').should('be.visible')
    cy.get('#email').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('should allow user to type email and password', () => {
    cy.fixture('loginData').then((loginData) => {
      cy.get('#email')
        .type(loginData.validCredentials.email)
        .should('have.value', loginData.validCredentials.email)
      
      cy.get('#password')
        .type(loginData.validCredentials.password)
        .should('have.value', loginData.validCredentials.password)
    })
  })

  it('should redirect to dashboard after successful login', () => {
    cy.fixture('loginData').then((loginData) => {
      cy.login(loginData.validCredentials.email, loginData.validCredentials.password)
      cy.url().should('include', '/dashboard')
    })
  })

  it('should show error message with invalid credentials', () => {
    cy.fixture('loginData').then((loginData) => {
      cy.login(loginData.invalidCredentials.email, loginData.invalidCredentials.password)
      cy.get('.bg-red-50', { timeout: 8000 }).should('be.visible')
      cy.url().should('include', '/auth/login')
    })
  })

  it('should login quickly using quickLogin command', () => {
    cy.quickLogin()
  })
})
