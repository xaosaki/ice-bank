import { checkReceiptUploadAndDelete, login } from '../../utils/utils';

describe('Transaction Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', /\/api\/v1\/transactions\//).as('getTransactionDetails');
    login();
  });

  it('should view transaction details', () => {
    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.wait('@getTransactionDetails');
    cy.url().should('include', '/transactions/');
    cy.get('[data-test-id="transaction-overline"]').should('be.visible');
    cy.get('[data-test-id="transaction-title"]').should('be.visible');
    cy.get('[data-test-id="transaction-subtitle"]').should('be.visible');
    cy.get('[data-test-id="transaction-side-block"]').should('be.visible');
  });

  it('should upload a receipt for the transaction', () => {
    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.wait('@getTransactionDetails');
    cy.url().should('include', '/transactions/');

    checkReceiptUploadAndDelete();
  });

  it('should navigate to create split flow from transaction details', () => {
    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.wait('@getTransactionDetails');
    cy.url().should('include', '/transactions/');
    cy.get('[data-test-id="create-split-button"]').click();
    cy.url().should('include', '/split-create');
  });
});
