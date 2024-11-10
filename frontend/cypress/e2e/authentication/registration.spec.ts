import { DEFAULT_USER_NAME } from '../../utils/consts';

describe('Registration Tests', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should navigate to the login page when clicking the login link', () => {
    cy.get('[data-test-id="login-link"]').click();
    cy.url().should('include', '/login');
  });

  it('should disable the register button if required fields are empty', () => {
    cy.get('[data-test-id="register-button"]').should('be.disabled');
  });

  it('should register successfully with valid inputs', () => {
    const uniqueEmail = `user+${Date.now()}@example.com`;
    const uniquePhone = `1${Math.floor(100000000 + Math.random() * 900000000)}`;

    cy.intercept('GET', '/api/v1/accounts').as('getAccounts');
    cy.get('[data-test-id="email-input"]').type(uniqueEmail);
    cy.get('[data-test-id="password-input"]').type('validPassword123');
    cy.get('[data-test-id="first-name-input"]').type('John');
    cy.get('[data-test-id="last-name-input"]').type('Doe');
    cy.get('[data-test-id="phone-input"]').type(uniquePhone);

    cy.get('[data-test-id="register-button"]').should('not.be.disabled').click();

    cy.url().should('include', '/accounts');
    cy.wait('@getAccounts').its('response.body').should('have.length', 3);

    cy.get('[data-test-id="current-account"]').should('be.visible');
    cy.get('[data-test-id="next-account"]').should('be.visible');
  });

  it('should show error when registering with an already registered email', () => {
    cy.get('[data-test-id="email-input"]').type(DEFAULT_USER_NAME);
    cy.get('[data-test-id="password-input"]').type('validPassword123');
    cy.get('[data-test-id="first-name-input"]').type('John');
    cy.get('[data-test-id="last-name-input"]').type('Doe');

    cy.get('[data-test-id="register-button"]').should('not.be.disabled').click();

    cy.get('[data-test-id="error-message"]')
      .should('be.visible')
      .and('contain', 'email must be unique');
  });
});
