import { login } from '../../utils/utils';

describe('Friends Management Tests', () => {
  beforeEach(() => {
    login();
    cy.intercept('GET', '/api/v1/friends').as('getFriends');
    cy.visit('/friends');
    cy.url().should('include', '/friends');
  });

  it('should add a friend and verify it appears in the list', () => {
    cy.get('[data-test-id="friend-search"]').type('k@m.com');
    cy.get('[data-test-id="add-friend-button"]').click();
    cy.wait('@getFriends');
    cy.get('[data-test-id="friend-list"]').should('contain.text', 'Kyle MacLachlan');
  });

  it('should remove a friend and verify it is removed from the list', () => {
    cy.get('[data-test-id="friend-list"]')
      .contains('Kyle MacLachlan')
      .parent()
      .within(() => {
        cy.get('[data-test-id="remove-friend-button"]').click();
      });
    cy.wait('@getFriends');
    cy.get('[data-test-id="friend-list"]').should('not.contain.text', 'Kyle MacLachlan');
  });
});
