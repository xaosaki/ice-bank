<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSelectedTransactionStore } from '@/stores/TransactionsStore';

const transactionStore = useSelectedTransactionStore();
const route = useRoute();
const transaction = computed(() => transactionStore.transaction);

onMounted(async () => {
  const idFromUrl = route.params.transactionId as string | undefined;

  if (idFromUrl) {
    transactionStore.selectTransactionId(idFromUrl);
    await transactionStore.fetchTransaction();
  }
});

onBeforeUnmount(async () => {
  transactionStore.selectTransactionId(null);
});
</script>

<template>
  <div>
    <h3>Transaction details:</h3>
    {{ transaction.date }}
    <br />
    {{ transaction.description }}
    <br />
    {{ transaction.amount }}
    <br />
    {{ transaction.note }}
  </div>
</template>
