import { defineStore } from 'pinia';
import type {
  Account,
  AccountTransaction,
  AccountTransactionGroup
} from '@/stores/interfaces/AccountsInterfaces';
import axiosWithToken from '@/api/AxiosWithToken';
import { mapAccountTransactions } from '@/stores/mappers/AccountTransactionsMapper';

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
    selectedAccountId: null as string | null,
    transactions: [] as AccountTransactionGroup[]
  }),
  actions: {
    async fetchAccounts() {
      try {
        const response = await axiosWithToken.get<Account[]>(`/api/v1/accounts`);
        this.accounts = response.data;
        this.selectedAccountId = response.data[0]?.accountId || null;
      } catch (e: any) {
        console.log('Error', e);
      }
    },

    async loadTransactions() {
      try {
        const response = await axiosWithToken.get<AccountTransaction[]>(
          `/api/v1/accounts/${this.selectedAccountId}/transactions`
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
