import { defineStore } from 'pinia';
import { httpClientWithToken } from '@/api/HttpClient';
import { mapAccountTransactions } from '@/stores/mappers/AccountTransactionsMapper';
import type {
  Account,
  AccountTransaction,
  AccountTransactionGroup
} from '@/stores/interfaces/AccountInterfaces';

const ACCOUNT_URL = '/api/v1/accounts';

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
    selectedAccountId: null as string | null,
    transactions: [] as AccountTransactionGroup[]
  }),
  actions: {
    async fetchAccounts() {
      try {
        const response = await httpClientWithToken.get<Account[]>(`${ACCOUNT_URL}`);
        this.accounts = response.data;
        this.selectedAccountId = response.data[0]?.accountId || null;
      } catch (e: any) {
        console.log('Error', e);
      }
    },

    async loadTransactions() {
      try {
        const response = await httpClientWithToken.get<AccountTransaction[]>(
          `${ACCOUNT_URL}/${this.selectedAccountId}/transactions`
        );
        this.transactions = mapAccountTransactions(response.data);
      } catch (e: any) {
        console.log('Error', e);
      }
    },

    selectAccount(accountId: string | null) {
      this.selectedAccountId = accountId;
      this.transactions = [];
    }
  },
  getters: {
    selectedAccount: (state) =>
      !!state.accounts.find((account) => account.accountId === state.selectedAccountId)
  }
});
