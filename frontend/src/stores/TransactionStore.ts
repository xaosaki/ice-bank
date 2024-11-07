import { defineStore } from 'pinia';
import { httpClientWithToken } from '@/api/HttpClient';
import type {
  SplitByTransaction,
  SplitByTransactionResponse,
  Transaction
} from '@/stores/interfaces/TransactionInterfaces';
import { faker } from '@faker-js/faker';
import { mapSplitByTransaction } from '@/stores/mappers/transaction/SplitByTransactionMapper';
import { v4 as uuidv4 } from 'uuid';

const TRANSACTION_URL = '/api/v1/transactions';
const OUT_SPLIT_URL = '/api/v1/splits/outgoing';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    selected: {} as Transaction,
    selectedReceipt: null as string | null,
    splitsBySelected: [] as SplitByTransaction[],
    selectedId: null as Transaction['transactionId'] | null
  }),
  actions: {
    async fetchTransaction() {
      try {
        const response = await httpClientWithToken.get<Transaction>(
          `${TRANSACTION_URL}/${this.selectedId}`
        );
        this.selected = response.data;
        if (this.selected.receipt) {
          await this.getReceipt();
        }
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async fetchSplitsByTransaction() {
      try {
        const response = await httpClientWithToken.get<SplitByTransactionResponse[]>(
          `${OUT_SPLIT_URL}?transactionId=${this.selectedId}`
        );
        this.splitsBySelected = response.data.map((item) => mapSplitByTransaction(item));
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async generateTransaction(accountId: string) {
      try {
        const fakeCompany = faker.company.name();
        const transaction = {
          transactionId: uuidv4(),
          accountId: accountId,
          amount: parseFloat(faker.finance.amount({ min: 1, max: 200, dec: 2 })),
          description: `${fakeCompany} #${faker.number.int(9999)} ${faker.location.city()}`,
          category: faker.helpers.arrayElement([
            'Groceries',
            'Dining',
            'Entertainment',
            'Transport',
            'Utilities'
          ]),
          merchant: {
            name: fakeCompany,
            logo: faker.image.urlLoremFlickr({ width: 100, height: 100, category: 'business' }),
            merchantId: uuidv4(),
            mcc: faker.finance.creditCardNumber('####')
          },
          note: `Bought ${faker.commerce.product()} and ${faker.commerce.product()}`
        };
        await httpClientWithToken.post(`${TRANSACTION_URL}`, transaction);
      } catch (e: any) {
        console.log('Error', e);
      }
    },

    async uploadReceipt(file: any) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await httpClientWithToken.post(`${TRANSACTION_URL}/${this.selectedId}/receipt`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        await this.fetchTransaction();
      } catch (error) {
        console.error('Error:', error);
      }
    },

    async getReceipt() {
      const response = await httpClientWithToken.get(
        `${TRANSACTION_URL}/${this.selectedId}/receipt`,
        {
          responseType: 'arraybuffer'
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedReceipt = reader.result as string;
      };
      reader.readAsDataURL(blob);
    },

    async deleteReceipt() {
      try {
        await httpClientWithToken.delete(`${TRANSACTION_URL}/${this.selectedId}/receipt`);
        this.selectedReceipt = null;
        this.selected.receipt = null;
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
