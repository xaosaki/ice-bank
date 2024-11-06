import { defineStore } from 'pinia';
import { httpClientWithToken } from '@/api/HttpClient';
import type {
  OutSplit,
  OutSplitGroup,
  OutSplitResponse
} from '@/stores/interfaces/OutSplitInterfaces';
import { mapOutSplitResponsesToGroup } from '@/stores/mappers/out-split/OutSplitGroupMapper';
import { mapOutSplit } from '@/stores/mappers/out-split/OutSplitMapper';

const OUT_SPLIT_URL = '/api/v1/splits/outgoing';
const TRANSACTION_URL = '/api/v1/transactions';

export const useOutSplitStore = defineStore('out-split', {
  state: () => ({
    list: [] as OutSplitGroup[],
    selectedReceipt: null as string | null,
    selectedId: null as string | null,
    selected: null as OutSplit | null
  }),
  actions: {
    async fetchList() {
      try {
        const response = await httpClientWithToken.get<OutSplitResponse[]>(`${OUT_SPLIT_URL}`);
        this.list = mapOutSplitResponsesToGroup(response.data);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async fetchSelected() {
      try {
        const response = await httpClientWithToken.get<OutSplitResponse>(
          `${OUT_SPLIT_URL}/${this.selectedId}`
        );
        this.selected = mapOutSplit(response.data);
        if (this.selected.receipt) {
          await this.getReceipt();
        }
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async cancelSelected() {
      try {
        await httpClientWithToken.delete(`${OUT_SPLIT_URL}/${this.selectedId}`);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async getReceipt() {
      const response = await httpClientWithToken.get(
        `${TRANSACTION_URL}/${this.selected?.transactionId}/receipt`,
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
    }
  },
  getters: {}
});
