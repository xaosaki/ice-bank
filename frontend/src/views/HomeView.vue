<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();
</script>

<template>
  <div v-if="userStore.user.userId">Hello, {{ userStore.user.firstName }}</div>
  <button v-if="userStore.isAuthenticated" type="button" @click="userStore.logout">Logout</button>
</template>
