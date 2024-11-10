import { getCurrentFormattedDate, login, logout } from '../../utils/utils';

describe('Account Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', /\/api\/v1\/accounts\/[^/]+\/transactions/).as('getTransactions');
    login();
  });

  it('should add a new transaction when "Generate Transaction" is clicked', () => {
    cy.wait('@getTransactions');

    const todayFormatted = getCurrentFormattedDate();

    cy.get('[data-test-id="transaction-list"]').then(($list) => {
      const dateSelector = `span:contains("${todayFormatted}")`;
      const dateExists = $list.find(dateSelector).length > 0;

      if (dateExists) {
        cy.contains('span', todayFormatted)
          .parents('li')
          .within(() => {
            cy.get('ul > li').its('length').as('initialCount');
          });

        cy.get('[data-test-id="generate-transaction"]').click();

        cy.get('@initialCount').then((initialCount) => {
          cy.contains('span', todayFormatted)
            .parents('li')
            .within(() => {
              cy.get('ul > li').should('have.length', Number(initialCount) + 1);
            });
        });
      } else {
        cy.get('[data-test-id="generate-transaction"]').click();

        cy.contains('span', todayFormatted)
          .parents('li')
          .within(() => {
            cy.get('div').should('contain.text', todayFormatted);
            cy.get('ul > li').should('have.length', 1);
          });
      }
    });
  });

  it('should switch between "Next Account" & "Previous Account"', () => {
    cy.get('[data-test-id="next-account"]').click();
    cy.get('[data-test-id="current-account"]').should('contain.text', 'Checking');
    cy.get('[data-test-id="previous-account"]').click();
    cy.get('[data-test-id="current-account"]').should('contain.text', 'Daily');
  });

  it('should log out and redirect to login screen', () => {
    logout();
  });
});
