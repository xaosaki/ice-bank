<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useOutSplitStore } from '@/stores/OutSplitStore';
import NavBar from '@/components/NavBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import SplitsTabBar from '@/components/SplitsTabBar.vue';
import LargeHeader from '@/components/LargeHeader.vue';

const outSplitStore = useOutSplitStore();

onMounted(async () => {
  await outSplitStore.fetchList();
});

onBeforeUnmount(async () => {
  outSplitStore.$reset();
});
</script>

<template>
  <div class="pb-20">
    <LargeHeader>
      <h3 class="text-4xl font-medium">Outgoing Splits</h3>
    </LargeHeader>
    <section class="px-6 pt-8">
      <SplitsTabBar />
      <TransactionList :transactions="outSplitStore.list" type="out-split" />
    </section>
  </div>

  <NavBar></NavBar>
</template>
