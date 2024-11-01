import { defineStore } from 'pinia';
import axiosWithToken from '@/api/AxiosWithToken';
import type {
  OutgoingSplitGroup,
  OutSplit,
  OutSplitResponse
} from '@/stores/interfaces/OutSplitInterfaces';
import { mapOutSplitResponsesToGroup } from '@/stores/mappers/out-split/OutSplitGroupMapper';
import { mapOutSplit } from '@/stores/mappers/out-split/OutSplitMapper';

const OUT_SPLIT_URL = '/api/v1/splits/outgoing';

export const useOutSplitStore = defineStore('out-split', {
  state: () => ({
    list: [] as OutgoingSplitGroup[],
    selectedId: null as string | null,
    selected: null as OutSplit | null
  }),
  actions: {
    async fetchOutgoingSplits() {
      try {
        const response = await axiosWithToken.get<OutSplitResponse[]>(`${OUT_SPLIT_URL}`);
        this.list = mapOutSplitResponsesToGroup(response.data);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async fetchSelectedSplit() {
      try {
        const response = await axiosWithToken.get<OutSplitResponse>(
          `${OUT_SPLIT_URL}/${this.selectedId}`
        );
        this.selected = mapOutSplit(response.data);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async cancelSelected() {
      try {
        await axiosWithToken.delete(`${OUT_SPLIT_URL}/${this.selectedId}`);
      } catch (e: any) {
        console.log('Error', e);
      }
    }
  },
  getters: {}
});
