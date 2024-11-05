<script setup lang="ts">
import { useRouter } from 'vue-router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();

defineProps<{
  title: string;
}>();
</script>

<template>
  <header class="relative flex items-center pt-12 text-primaryText">
    <button
      @click="router.back()"
      class="absolute left-5 top-13 flex justify-center content-center text-primaryText w-6 h-6 text-2xl"
      type="button"
    >
      <font-awesome-icon :icon="faArrowLeft" />
    </button>

    <h1 class="mx-auto text-2xl font-medium">
      {{ title }}
    </h1>
  </header>
</template>
