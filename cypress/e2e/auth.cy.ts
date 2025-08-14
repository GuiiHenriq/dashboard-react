describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login', { 
      fixture: 'api-responses.json',
      statusCode: 200 
    }).as('loginRequest')
    
    cy.intercept('POST', '**/api/auth/register', { 
      fixture: 'api-responses.json',
      statusCode: 201 
    }).as('registerRequest')
  })

  it('should login successfully with valid credentials', () => {
    cy.fixture('users').then((users) => {
      cy.visit('/auth/login')
      
      cy.get('[data-cy="email-input"]').type(users.validUser.email)
      cy.get('[data-cy="password-input"]').type(users.validUser.password)
      cy.get('[data-cy="submit-button"]').click()
      
      cy.wait('@loginRequest')
      cy.url().should('include', '/dashboard')
    })
  })

  it('should register successfully with valid data', () => {
    cy.fixture('users').then((users) => {
      cy.visit('/auth/register')
      
      cy.get('[data-cy="firstName-input"]').type(users.newUser.firstName)
      cy.get('[data-cy="lastName-input"]').type(users.newUser.lastName)
      cy.get('[data-cy="email-input"]').type(users.newUser.email)
      cy.get('[data-cy="password-input"]').type(users.newUser.password)
      cy.get('[data-cy="confirmPassword-input"]').type(users.newUser.confirmPassword)
      cy.get('[data-cy="submit-button"]').click()
      
      cy.wait('@registerRequest')
      cy.url().should('include', '/dashboard')
    })
  })

  it('should redirect unauthenticated users to login', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/auth/login')
  })
})
