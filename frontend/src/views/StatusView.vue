<script setup lang="ts">
import { useStatusStore } from '@/stores/StatusStore';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const statusStore = useStatusStore();
const router = useRouter();

onMounted(async () => {
  if (!statusStore.status) {
    await router.push('/accounts');
  }
});

onBeforeUnmount(async () => {
  statusStore.$reset();
});
</script>
<template>
  <h3>{{ statusStore.heading }}</h3>

  {{ statusStore.message }}

  <br />
  <br />
  {{ statusStore.action }} icon

  <br />
  <br />

  <RouterLink :to="statusStore.next">OK</RouterLink>
</template>
