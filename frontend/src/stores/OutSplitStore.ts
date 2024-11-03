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

export const useOutSplitStore = defineStore('out-split', {
  state: () => ({
    list: [] as OutSplitGroup[],
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
    }
  },
  getters: {}
});
