import { defineStore } from 'pinia';
import axiosWithToken from '@/api/AxiosWithToken';
import type { Friend } from '@/stores/interfaces/FriendInterfaces';

const FRIEND_URL = '/api/v1/friends';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    list: [] as Friend[]
  }),
  actions: {
    async fetchFriends() {
      try {
        const response = await axiosWithToken.get<Friend[]>(`${FRIEND_URL}`);
        this.list = response.data;
      } catch (e: any) {
        console.log('Error', e);
      }
    }
  },
  getters: {}
});
