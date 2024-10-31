<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();

onMounted(() => {
  if (userStore.isAuthenticated) {
    userStore.fetchProfile();
  }
});
</script>

<template>
  <RouterView />
</template>
