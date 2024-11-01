<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useOutSplitStore } from '@/stores/OutSplitStore';

const outSplitStore = useOutSplitStore();

onMounted(async () => {
  await outSplitStore.fetchOutgoingSplits();
});

onBeforeUnmount(async () => {
  outSplitStore.$reset();
});
</script>

<template>
  <div>
    <h3>Outgoing splits:</h3>
    <ul>
      <li v-for="(group, id) of outSplitStore.list" :key="id">
        {{ group.status }}
        <ul>
          <li v-for="split of group.splits" :key="split.splitId">
            <RouterLink :to="`/out-splits/${split.splitId}`">
              {{ split.transactionDate }} | {{ split.transactionName }} |
              {{ split.filledAmount }} of {{ split.amount }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <RouterLink to="/accounts">To accounts</RouterLink>
</template>
