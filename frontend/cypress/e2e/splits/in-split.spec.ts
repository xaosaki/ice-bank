import {
  countPendingAfterAdd,
  getInitialPendingCount,
  login,
  logout,
  processOK
} from '../../utils/utils';
import { SECOND_USER_NAME, SECOND_USER_PASSWORD } from '../../utils/consts';

describe('Incoming Split Tests', () => {
  let initialPendingCount: number;

  const goToInSplit = (alias = 'getInSplits') => {
    cy.intercept('GET', /\/api\/v1\/splits\/incoming/).as(alias);
    cy.visit('/in-splits');
    cy.wait(`@${alias}`, { timeout: 1000 });
  };

  const goToInSplitDetails = () => {
    goToInSplit();

    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.url().should('include', '/in-splits/');
  };

  before(() => {
    login(SECOND_USER_NAME, SECOND_USER_PASSWORD);
    goToInSplit('goToInSplitsBefore');

    getInitialPendingCount().then((count) => {
      initialPendingCount = count;
    });

    logout();
  });

  beforeEach(() => {
    login();
    cy.get('[data-test-id="transaction-list"] li a').first().click();
    cy.get('[data-test-id="create-split-button"]').click();
    cy.url().should('match', /\/split-create\/[^/]+\/friend-selector/);

    cy.get('[data-test-id="friend-action-button"]').contains('Jane Doe').click();
    cy.get('[data-test-id="next-button"]').click();
    cy.url().should('match', /\/split-create\/[^/]+\/params/);
    cy.get('[data-test-id="ask-button"]').click();
    cy.url().should('include', '/status');
    cy.get('[data-test-id="next-button"]').click();
    cy.url().should('include', '/accounts');

    logout();
  });

  it('should display the newly created pending split for the receiving user', () => {
    login(SECOND_USER_NAME, SECOND_USER_PASSWORD);
    goToInSplit();

    countPendingAfterAdd(initialPendingCount);
  });

  it('should add a comment and pay the split', () => {
    login(SECOND_USER_NAME, SECOND_USER_PASSWORD);
    goToInSplitDetails();

    cy.get('[data-test-id="comment"]').type('Payment for split');
    cy.get('[data-test-id="pay-now-button"]').click();
    cy.url().should('include', '/status');
    cy.get('[data-test-id="status-header"]').should('contain', 'was sent');

    processOK('/in-splits');
  });

  it('should add a comment and decline the split', () => {
    login(SECOND_USER_NAME, SECOND_USER_PASSWORD);
    goToInSplitDetails();

    cy.get('[data-test-id="comment"]').type('Declining split');
    cy.get('[data-test-id="decline-button"]').click();
    cy.url().should('include', '/status');
    cy.get('[data-test-id="status-header"]').should('contain', 'Split declined');

    processOK('/in-splits');
  });
});
