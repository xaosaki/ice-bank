import { defineStore } from 'pinia';
import { httpClientWithToken } from '@/api/HttpClient';
import type {
  InSplit,
  InSplitGroup,
  InSplitProcessParams,
  InSplitResponse
} from '@/stores/interfaces/InSplitInterfaces';
import { mapInSplitResponsesToGroup } from '@/stores/mappers/in-split/InSplitGroupMapper';

const IN_SPLIT_URL = '/api/v1/splits/incoming';

export const useInSplitStore = defineStore('in-split', {
  state: () => ({
    list: [] as InSplitGroup[],
    selectedReceipt: null as string | null,
    selectedId: null as string | null,
    selected: null as InSplit | null,
    isListFetched: false
  }),
  actions: {
    async fetchList() {
      try {
        const response = await httpClientWithToken.get<InSplitResponse[]>(`${IN_SPLIT_URL}`);
        this.list = mapInSplitResponsesToGroup(response.data);
        this.isListFetched = true;
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async fetchSelected() {
      try {
        const response = await httpClientWithToken.get<InSplit>(
          `${IN_SPLIT_URL}/${this.selectedId}`
        );
        this.selected = response.data;
        if (this.selected.receipt) {
          await this.getReceipt();
        }
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async processSelected(processParams: InSplitProcessParams) {
      try {
        await httpClientWithToken.post(`${IN_SPLIT_URL}/${this.selectedId}/process`, processParams);
      } catch (e: any) {
        console.log('Error', e);
        throw e;
      }
    },
    async getReceipt() {
      const response = await httpClientWithToken.get(`${IN_SPLIT_URL}/${this.selectedId}/receipt`, {
        responseType: 'arraybuffer'
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      const reader = new FileReader();
      reader.onloadend = () => {
        this.selectedReceipt = reader.result as string;
      };
      reader.readAsDataURL(blob);
    }
  },
  getters: {
    isHasPending: (state) => {
      return state.list.some((item) => item.status === 'Pending');
    }
  }
});
