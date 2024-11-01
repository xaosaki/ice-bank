import { defineStore } from 'pinia';
import axiosWithToken from '@/api/AxiosWithToken';
import type { Transaction } from '@/stores/interfaces/TransactionInterfaces';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    selected: {} as Transaction,
    selectedId: null as Transaction['transactionId'] | null
  }),
  actions: {
    async fetchTransaction() {
      try {
        const response = await axiosWithToken.get<Transaction>(
          `/api/v1/transactions/${this.selectedId}`
        );
        this.selected = response.data;
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    setTransactionId(transactionId: string | null) {
      this.selectedId = transactionId;
      this.selected = {} as Transaction;
    }
  }
});
