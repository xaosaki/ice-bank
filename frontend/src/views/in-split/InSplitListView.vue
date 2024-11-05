<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useInSplitStore } from '@/stores/InSplitStore';
import NavBar from '@/components/NavBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import SplitsTabBar from '@/components/SplitsTabBar.vue';
import LargeHeader from '@/components/LargeHeader.vue';

const inSplitStore = useInSplitStore();

onMounted(async () => {
  await inSplitStore.fetchList();
});

onBeforeUnmount(async () => {
  inSplitStore.$patch({
    selectedId: null,
    selected: null
  });
});
</script>

<template>
  <div class="pb-20">
    <LargeHeader>
      <h3 class="text-4xl font-medium">Incoming Splits</h3>
    </LargeHeader>
    <section class="px-6 pt-8">
      <SplitsTabBar />
      <TransactionList :transactions="inSplitStore.list" type="in-split" />
    </section>
  </div>

  <NavBar></NavBar>
</template>
