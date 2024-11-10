import {
  checkReceiptUploadAndDelete,
  countPendingAfterAdd,
  getInitialPendingCount,
  login,
  processOK
} from '../../utils/utils';

describe('Split Creation Tests', () => {
  let initialPendingCount = 0;

  before(() => {
    login();
    cy.intercept('GET', /\/api\/v1\/splits\/outgoing/).as('getOutSplits');
    cy.visit('/out-splits');
    cy.wait('@getOutSplits', { timeout: 1000 });

    getInitialPendingCount().then((count) => {
      initialPendingCount = count;
    });

    cy.visit('/accounts');
  });

  it('should navigate through split creation flow and verify in outgoing splits', () => {
    cy.intercept('GET', /\/api\/v1\/transactions\//).as('getTransactionDetails');
    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.wait('@getTransactionDetails');
    cy.url().should('include', '/transactions/');

    cy.get('[data-test-id="create-split-button"]').click();
    cy.url().should('match', /\/split-create\/[^/]+\/friend-selector/);

    cy.get('[data-test-id="friend-action-button"]').each(($button, index) => {
      if (index < 2 && $button.hasClass('cursor-pointer')) {
        cy.wrap($button).click();
      }
    });
    cy.get('[data-test-id="next-button"]').should('not.be.disabled').click();

    cy.url().should('match', /\/split-create\/[^/]+\/params/);
    cy.get('[data-test-id="transaction-overline"]').should('be.visible');
    cy.get('[data-test-id="transaction-title"]').should('be.visible');
    cy.get('[data-test-id="transaction-side-block"]').should('be.visible');
    checkReceiptUploadAndDelete();

    cy.get('[data-test-id="split-amount-input"]').each(($input) => {
      cy.wrap($input).clear();
      cy.wrap($input).type('10.99');
    });
    cy.get('[data-test-id="ask-button"]').click();

    cy.url().should('include', '/status');
    cy.get('[data-test-id="status-header"]').should('contain.text', 'Requests sent');
    cy.get('[data-test-id="status-message"]').should(
      'contain.text',
      'Jane, Bob will receive notifications'
    );
    processOK('/accounts');

    cy.intercept('GET', /\/api\/v1\/splits\/outgoing/).as('getOutSplitsAfterCreation');
    cy.visit('/out-splits');
    cy.wait('@getOutSplitsAfterCreation', { timeout: 1000 });

    countPendingAfterAdd(initialPendingCount);
  });
});
