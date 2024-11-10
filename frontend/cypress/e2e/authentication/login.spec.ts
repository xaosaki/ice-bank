import { login } from '../../utils/utils';

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in successfully with valid credentials', () => {
    login();
  });

  it('should show an error message with invalid credentials', () => {
    cy.get('[data-test-id="email-input"]').type('no@no.com ');
    cy.get('[data-test-id="password-input"]').type('invalidPassword');
    cy.get('[data-test-id="login-button"]').click();

    cy.get('[data-test-id="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid email or password');
  });

  it('should keep the login button disabled with empty fields', () => {
    cy.get('[data-test-id="login-button"]').should('be.disabled');
  });

  it('should navigate from the login page to the registration page', () => {
    cy.get('[data-test-id="register-link"]').click();
    cy.url().should('include', '/register');
  });
});
