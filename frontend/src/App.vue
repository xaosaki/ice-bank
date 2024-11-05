<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useInSplitStore } from '@/stores/InSplitStore';

const userStore = useUserStore();
const inSplitStore = useInSplitStore();

onMounted(() => {
  if (userStore.isAuthenticated) {
    userStore.fetchProfile();
    inSplitStore.fetchList();
  }
});
</script>

<template>
  <div class="bg-background text-primaryText h-screen md:max-w-5xl md:mx-auto">
    <RouterView />
  </div>
</template>
