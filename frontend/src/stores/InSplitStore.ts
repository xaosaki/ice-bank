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
    selectedId: null as string | null,
    selected: null as InSplit | null
  }),
  actions: {
    async fetchList() {
      try {
        const response = await httpClientWithToken.get<InSplitResponse[]>(`${IN_SPLIT_URL}`);
        this.list = mapInSplitResponsesToGroup(response.data);
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
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async processSelected(processParams: InSplitProcessParams) {
      try {
        await httpClientWithToken.post(`${IN_SPLIT_URL}/${this.selectedId}/process`, processParams);
      } catch (e: any) {
        console.log('Error', e);
      }
    }
  },
  getters: {}
});
