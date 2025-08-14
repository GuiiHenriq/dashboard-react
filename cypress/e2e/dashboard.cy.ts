describe('Dashboard E2E Tests', () => {
  let dashboardData: any;

  before(() => {
    cy.fixture('dashboardData').then((data) => {
      dashboardData = data;
    });
  });

  beforeEach(() => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type(dashboardData.loginCredentials.email);
    cy.get('input[name="password"]').type(dashboardData.loginCredentials.password);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('should load dashboard correctly and display users list', () => {
    cy.contains('h1', 'Dashboard').should('be.visible');
    cy.contains('h2', 'Users Management').should('be.visible');
    cy.get('[data-cy="create-user-btn"]').should('be.visible');
    
    cy.get('[data-cy="users-grid"]').should('be.visible');
    
    cy.get('body').should('not.contain', 'Loading Dashboard...');
    
    cy.get('body').then($body => {
      if ($body.find('[data-cy="pagination"]').length > 0) {
        cy.get('[data-cy="pagination"]').should('be.visible');
      }
    });
  });

  it('should create a new user successfully', () => {
    cy.get('[data-cy="create-user-btn"]').click();
    
    cy.get('[data-cy="user-modal"]').should('be.visible');
    cy.contains('Create New User').should('be.visible');
    
    cy.get('input[name="first_name"]').type(dashboardData.validUser.first_name);
    cy.get('input[name="last_name"]').type(dashboardData.validUser.last_name);
    cy.get('input[name="email"]').type(dashboardData.validUser.email);
    cy.get('input[name="job"]').type(dashboardData.validUser.job);
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-cy="user-modal"]').should('not.exist');
    
    cy.contains('User created successfully!', { timeout: 10000 }).should('be.visible');
    
    cy.get('[data-cy="users-grid"]').should('be.visible');
  });

  it('should edit an existing user successfully', () => {
    cy.get('[data-cy="user-card"]').should('have.length.at.least', 1);
    cy.get('[data-cy="user-card"]').first().within(() => {
      cy.get('[data-cy="edit-user-btn"]').click();
    });
    
    cy.get('[data-cy="user-modal"]').should('be.visible');
    cy.contains('Edit User').should('be.visible');
    
    cy.get('input[name="first_name"]').clear().type(dashboardData.updatedUser.first_name);
    cy.get('input[name="last_name"]').clear().type(dashboardData.updatedUser.last_name);
    cy.get('input[name="email"]').clear().type(dashboardData.updatedUser.email);
    cy.get('input[name="job"]').clear().type(dashboardData.updatedUser.job);
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-cy="user-modal"]').should('not.exist');
    cy.contains('User updated successfully!', { timeout: 10000 }).should('be.visible');
    
    cy.get('[data-cy="users-grid"]').should('be.visible');
  });

  it('should delete a user successfully', () => {
    cy.get('[data-cy="user-card"]').should('have.length.at.least', 1).then($cards => {
      const initialCount = $cards.length;
      
      cy.get('[data-cy="user-card"]').first().within(() => {
        cy.get('[data-cy="delete-user-btn"]').click();
      });
      
      cy.get('[data-cy="delete-confirmation"]').should('be.visible');
      cy.contains('Delete User').should('be.visible');
      cy.contains('Are you sure you want to delete').should('be.visible');
      
      cy.get('[data-cy="confirm-delete-btn"]').click();
      
      cy.contains('User deleted successfully!', { timeout: 10000 }).should('be.visible');
      
      cy.get('[data-cy="users-grid"]').should('be.visible');
    });
  });

  it('should navigate pagination correctly', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-cy="pagination"]').length > 0) {
        cy.get('[data-cy="pagination"]').should('be.visible');
        
        cy.get('[data-cy="pagination"]').within(() => {
          cy.get('button').contains('Next').then($nextBtn => {
            if (!$nextBtn.prop('disabled')) {
              cy.wrap($nextBtn).click();
              
              cy.get('[data-cy="users-grid"]').should('be.visible');
              
              cy.get('button').contains('Previous').should('not.be.disabled');
              
              cy.get('button').contains('Previous').click();
              cy.get('[data-cy="users-grid"]').should('be.visible');
            }
          });
        });
      } else {
        cy.log('Pagination not available - single page of results');
      }
    });
  });

  it('should handle empty state when no users exist', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-cy="no-users-state"]').length > 0) {
        cy.get('[data-cy="no-users-state"]').should('be.visible');
        cy.contains('No users found').should('be.visible');
        cy.get('[data-cy="create-first-user-btn"]').should('be.visible');
      }
    });
  });
});
