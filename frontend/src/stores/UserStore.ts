import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router/Router';
import axiosWithToken from '@/api/AxiosWithToken';
import type {
  LoginParams,
  LoginResponse,
  Profile,
  RegisterParams
} from '@/stores/interfaces/UserInterfaces';

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
        const response = await axios.post<LoginResponse>(`/api/v1/auth/login`, params);
        this.token = response.data.accessToken;
        localStorage.setItem('token', response.data.accessToken);
        await this.fetchProfile();
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
        await axios.post(`/api/v1/auth/register`, { ...params, userId });
        await this.login({ email: params.email, password: params.password });
      } catch (e: any) {
        console.log('Error during registration', e);
        this.serverError = e.response?.data?.message || null;
      }
    },

    async fetchProfile() {
      try {
        const response = await axiosWithToken.get<Profile>(`/api/v1/profile`);
        this.user = response.data;
      } catch (e) {
        console.log('Error', e);
      }
    },

    async logout() {
      try {
        await axiosWithToken.post(`/api/v1/auth/logout`);
        this.token = null;
        this.user = {} as Profile;
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
