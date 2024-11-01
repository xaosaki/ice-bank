import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import { useUserStore } from '@/stores/UserStore';
import AccountsView from '@/views/AccountsView.vue';
import TransactionView from '@/views/TransactionView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/accounts/:accountId?',
      name: 'accounts',
      component: AccountsView
    },
    {
      path: '/transactions/:transactionId',
      name: 'transactionDetails',
      component: TransactionView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        public: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        public: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name === 'login' && userStore.isAuthenticated) {
    next('/');
  }

  if (!to.meta.public && !userStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
