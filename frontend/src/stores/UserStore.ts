import { defineStore } from 'pinia';
import router from '@/router/Router';
import { httpClient, httpClientWithToken } from '@/api/HttpClient';
import type {
  LoginParams,
  LoginResponse,
  Profile,
  RegisterParams
} from '@/stores/interfaces/UserInterfaces';
import { useTransactionStore } from '@/stores/TransactionStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import { useOutSplitStore } from '@/stores/OutSplitStore';
import { useFriendStore } from '@/stores/FriendStore';
import { useAccountStore } from '@/stores/AccountStore';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';

const AUTH_URL = '/api/v1/auth';
const PROFILE_URL = '/api/v1/profile';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: {} as Profile,
    serverError: null
  }),
  actions: {
    async login(params: LoginParams) {
      this.serverError = null;
      try {
        const response = await httpClient.post<LoginResponse>(`${AUTH_URL}/login`, params);
        this.token = response.data.accessToken;
        localStorage.setItem('token', response.data.accessToken);
        await this.fetchProfile();

        const inSplitStore = useInSplitStore();
        await inSplitStore.fetchList();
        await router.push(`/accounts`);
      } catch (e: any) {
        console.log('Error during login', e);
        this.serverError = e.response?.data?.message || null;
      }
    },

    async register(params: RegisterParams) {
      this.serverError = null;
      try {
        const userId = crypto.randomUUID();
        await httpClient.post(`${AUTH_URL}/register`, { ...params, userId });
        await this.login({ email: params.email, password: params.password });
      } catch (e: any) {
        console.log('Error during registration', e);
        this.serverError = e.response?.data?.message || null;
      }
    },

    async fetchProfile() {
      try {
        const response = await httpClientWithToken.get<Profile>(`${PROFILE_URL}`);
        this.user = response.data;
      } catch (e) {
        console.log('Error', e);
      }
    },

    async logout() {
      try {
        await httpClientWithToken.post(`${AUTH_URL}/logout`);
        this.token = null;
        this.user = {} as Profile;
        const stores = [
          useTransactionStore(),
          useInSplitStore(),
          useOutSplitStore(),
          useFriendStore(),
          useAccountStore(),
          useSplitCreateStore()
        ];

        stores.forEach((store) => store.$reset());

        localStorage.removeItem('token');
        router.push(`/login`).then();
      } catch (e) {
        console.log('Error in logout', e);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
});
