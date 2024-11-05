<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import NavItem from '@/components/NavItem.vue';
import { faChartPie, faUserGroup, faWallet } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();

const isActiveLink = (routePath: string) => {
  const route = useRoute();
  return route.path.includes(routePath);
};

const items = [
  { name: 'accounts', icon: faWallet, label: 'Accounts', path: '/accounts' },
  { name: 'splits', icon: faChartPie, label: 'Share', path: '/out-splits' },
  { name: 'friends', icon: faUserGroup, label: 'Friends', path: '/friends' }
];
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 flex justify-around bg-surface py-4 md:max-w-5xl md:mx-auto"
  >
    <NavItem
      class="w-1/3"
      v-for="item in items"
      :key="item.name"
      :icon="item.icon as any"
      :label="item.label"
      :is-active="isActiveLink(item.name)"
      @click="() => router.push(item.path)"
    />
  </nav>
</template>
