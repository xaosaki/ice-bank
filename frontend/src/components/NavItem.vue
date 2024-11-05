<script setup lang="ts">
import { useInSplitStore } from '@/stores/InSplitStore';

withDefaults(
  defineProps<{
    icon: any;
    label: string;
    isActive?: boolean;
  }>(),
  { isActive: false }
);

const inSplitStore = useInSplitStore();
</script>

<template>
  <div
    @click="$emit('click')"
    :class="[
      'flex flex-col items-center cursor-pointer transition',
      isActive ? 'text-primary' : 'text-primaryText'
    ]"
  >
    <div class="relative">
      <font-awesome-icon :icon="icon" class="w-6 h-6" />
      <span
        v-if="label === 'Share' && inSplitStore.isHasPending"
        class="absolute top-0 right-0 bg-danger w-2 h-2 rounded-full"
      ></span>
    </div>
    <span class="mt-1 text-sm font-medium">{{ label }}</span>
  </div>
</template>
