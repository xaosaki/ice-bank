import { defineStore } from 'pinia';
import axiosWithToken from '@/api/AxiosWithToken';
import type { Transaction } from '@/stores/interfaces/TransactionsInterfaces';

export const useSelectedTransactionStore = defineStore('selectedTransaction', {
  state: () => ({
    transaction: {} as Transaction,
    transactionId: null as Transaction['transactionId'] | null
  }),
  actions: {
    async fetchTransaction() {
      try {
        const response = await axiosWithToken.get<Transaction>(
          `/api/v1/transactions/${this.transactionId}`
        );
        this.transaction = response.data;
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    selectTransactionId(transactionId: string | null) {
      this.transactionId = transactionId;
      this.transaction = {} as Transaction;
    }
  }
});
