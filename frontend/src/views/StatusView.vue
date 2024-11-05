<script setup lang="ts">
import { useStatusStore } from '@/stores/StatusStore';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

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
  <div class="flex flex-col items-center justify-between min-h-screen p-6 bg-background">
    <div class="mt-60 flex flex-col items-center">
      <h1 class="text-2xl font-medium text-primaryText mb-7">{{ statusStore.heading }}</h1>
      <p class="text-secondaryText text-center font-semibold mt-2 mb-16">
        {{ statusStore.message }}
      </p>

      <font-awesome-icon
        :icon="statusStore.action === 'Done' ? faCircleCheck : faCircleXmark"
        class="w-24 h-24 bg-background text-4xl"
        :class="statusStore.status === 'OK' ? 'text-primary' : 'text-danger'"
      />
    </div>

    <BaseButton class="block w-full mb-4" @click="router.push(statusStore.next)"> OK</BaseButton>
  </div>
</template>
