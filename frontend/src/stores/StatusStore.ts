import { defineStore } from 'pinia';
import type { StatusAction, StatusStatus } from '@/stores/interfaces/StatusInterfaces';

export const useStatusStore = defineStore('status', {
  state: () => ({
    status: null as StatusStatus | null,
    action: null as StatusAction | null,
    heading: null as string | null,
    message: null as string | null,
    next: '/accounts'
  }),
  actions: {},
  getters: {}
});
