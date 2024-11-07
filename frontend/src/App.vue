<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import { useAccountStore } from '@/stores/AccountStore';
import { useSocket } from '@/composables/UseSocket';

const userStore = useUserStore();
const accountsStore = useAccountStore();
const inSplitStore = useInSplitStore();

const loadData = () => {
  if (userStore.isAuthenticated) {
    userStore.fetchProfile();
    accountsStore.fetchAccounts();
    inSplitStore.fetchList();
  }
};

const initSocket = () => {
  if (userStore.isAuthenticated) {
    // Инициализируем сокет через useSocket
    const { initializeSocket } = useSocket(userStore.token);
    initializeSocket();
  }
};

watch(() => userStore.isAuthenticated, loadData);

onMounted(() => {
  loadData();
  initSocket();
});
</script>

<template>
  <div class="bg-background text-primaryText h-screen md:max-w-5xl md:mx-auto">
    <RouterView />
  </div>
</template>
