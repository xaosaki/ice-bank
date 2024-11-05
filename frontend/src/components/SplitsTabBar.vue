<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useInSplitStore } from '@/stores/InSplitStore';

const router = useRouter();

const isActiveLink = (routePath: string) => {
  const route = useRoute();
  return route.path.includes(routePath);
};

const inSplitStore = useInSplitStore();

const items = [
  { name: 'out', label: 'Outgoing', path: '/out-splits' },
  { name: 'in', label: 'Incoming', path: '/in-splits' }
];
</script>

<template>
  <div class="flex bg-surface rounded-full p-1 mb-8">
    <button
      v-for="(item, id) in items"
      :key="id"
      :class="[
        'flex-1 py-2 rounded-full transition relative',
        isActiveLink(item.path) ? 'bg-background text-primaryText' : 'text-secondaryText'
      ]"
      @click="router.push(item.path)"
    >
      <span
        v-if="item.name === 'in' && inSplitStore.isHasPending"
        class="inline-block w-2.5 h-2.5 bg-danger rounded-full mr-1"
      ></span>
      {{ item.label }}
    </button>
  </div>
</template>
