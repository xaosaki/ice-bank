import { format } from 'date-fns';
import { DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD } from './consts';

export const login = (
  email: string = DEFAULT_USER_NAME,
  password: string = DEFAULT_USER_PASSWORD
) => {
  cy.visit('/login');
  cy.get('[data-test-id="email-input"]').type(email);
  cy.get('[data-test-id="password-input"]').type(password);
  cy.get('[data-test-id="login-button"]').click();
  cy.url().should('include', '/accounts');
};

export const logout = () => {
  cy.visit('/accounts');
  cy.get('[data-test-id="logout-button"]').click();
  cy.url().should('include', '/login');
};

export const processOK = (next: string) => {
  cy.get('[data-test-id="next-button"]').should('contain.text', 'OK');
  cy.get('[data-test-id="next-button"]').click();
  cy.url().should('include', next);
};

export const getInitialPendingCount = () => {
  return cy
    .get('[data-test-id="transaction-list"]')
    .should('exist')
    .then(($list) => {
      const pendingGroup = $list.find('span:contains("Pending")');
      let initialPendingCount = 0;
      if (pendingGroup.length > 0) {
        initialPendingCount = pendingGroup.parents('li').find('ul > li').length;
      }
      return initialPendingCount;
    });
};

export const countPendingAfterAdd = (initialPendingCount: number) => {
  cy.get('[data-test-id="transaction-list"]')
    .should('exist')
    .then(($list) => {
      const pendingGroup = $list.find('span:contains("Pending")');
      cy.wrap(pendingGroup)
        .parents('li')
        .within(() => {
          cy.get('ul > li')
            .its('length')
            .should('eq', initialPendingCount + 1);
        });
    });
};

export const checkReceiptUploadAndDelete = () => {
  cy.get('[data-test-id="upload-file-button"]').click();
  cy.get('input[type="file"]').selectFile('cypress/fixtures/sample-image.png', { force: true });
  cy.get('[data-test-id="uploaded-image"]').should('be.visible');
  cy.get('[data-test-id="remove-file-button"]').click();
  cy.get('[data-test-id="uploaded-image"]').should('not.exist');
};

export const getCurrentFormattedDate = () => {
  const dateObj = new Date();

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return format(new Date(year, Number(month) - 1, Number(day)), 'EEEE, do MMMM');
};
