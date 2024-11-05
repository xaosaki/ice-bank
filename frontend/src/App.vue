<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import { useAccountStore } from '@/stores/AccountStore';

const userStore = useUserStore();
const accountsStore = useAccountStore();
const inSplitStore = useInSplitStore();

onMounted(() => {
  if (userStore.isAuthenticated) {
    userStore.fetchProfile();
    accountsStore.fetchAccounts();
    inSplitStore.fetchList();
  }
});
</script>

<template>
  <div class="bg-background text-primaryText h-screen md:max-w-5xl md:mx-auto">
    <RouterView />
  </div>
</template>
