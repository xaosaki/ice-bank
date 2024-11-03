import { defineStore } from 'pinia';
import { httpClientWithToken } from '@/api/HttpClient';
import type { Friend } from '@/stores/interfaces/FriendInterfaces';

const FRIEND_URL = '/api/v1/friends';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    list: [] as Friend[]
  }),
  actions: {
    async fetchFriends() {
      try {
        const response = await httpClientWithToken.get<Friend[]>(`${FRIEND_URL}`);
        this.list = response.data;
      } catch (e: any) {
        console.log('Error', e);
      }
    }
  },
  getters: {}
});
