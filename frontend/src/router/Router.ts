import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import { useUserStore } from '@/stores/UserStore';
import TransactionView from '@/views/TransactionView.vue';
import AccountView from '@/views/AccountView.vue';
import SplitCreateFriendSelectorView from '@/views/split-create/SplitCreateFriendSelectorView.vue';
import SplitCreateView from '@/views/split-create/SplitCreateView.vue';
import SplitCreateParamsView from '@/views/split-create/SplitCreateParamsView.vue';
import StatusView from '@/views/StatusView.vue';
import OutSplitListView from '@/views/out-split/OutSplitListView.vue';
import OutSplitView from '@/views/out-split/OutSplitView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'accounts'
    },
    {
      path: '/accounts/:accountId?',
      name: 'accounts',
      component: AccountView
    },
    {
      path: '/transactions/:transactionId',
      name: 'transactionDetails',
      component: TransactionView
    },
    {
      path: '/split-create/:transactionId',
      name: 'splitCreate',
      component: SplitCreateView,
      children: [
        {
          path: 'friend-selector',
          component: SplitCreateFriendSelectorView
        },
        {
          path: 'params',
          component: SplitCreateParamsView
        }
      ]
    },
    {
      path: '/status',
      component: StatusView
    },
    {
      path: '/out-splits',
      name: 'outSplits',
      component: OutSplitListView
    },
    {
      path: '/out-splits/:splitId',
      name: 'outSplitDetails',
      component: OutSplitView
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
