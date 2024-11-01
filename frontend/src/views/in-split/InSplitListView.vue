<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useInSplitStore } from '@/stores/InSplitStore';

const inSplitStore = useInSplitStore();

onMounted(async () => {
  await inSplitStore.fetchList();
});

onBeforeUnmount(async () => {
  inSplitStore.$reset();
});
</script>

<template>
  <div>
    <h3>Incoming splits:</h3>
    <ul>
      <li v-for="(group, id) of inSplitStore.list" :key="id">
        {{ group.status }}
        <ul>
          <li v-for="split of group.splits" :key="split.splitId">
            <RouterLink :to="`/in-splits/${split.splitId}`">
              {{ split.transactionDate }} | {{ split.fromUser.firstName }}:
              {{ split.transactionName }} | | {{ split.amountForPay }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <RouterLink to="/out-splits">To outgoing</RouterLink>
  <br />
  <RouterLink to="/accounts">To accounts</RouterLink>
</template>
