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
    },
    async add(userIdOrEmail: string) {
      try {
        await httpClientWithToken.post(`${FRIEND_URL}/${userIdOrEmail}`);
      } catch (e: any) {
        console.log('Error', e);
      }
    },
    async remove(userId: string) {
      try {
        await httpClientWithToken.delete(`${FRIEND_URL}/${userId}`);
      } catch (e: any) {
        console.log('Error', e);
      }
    }
  },
  getters: {}
});
