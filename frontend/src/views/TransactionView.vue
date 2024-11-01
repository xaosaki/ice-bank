<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/Router';
import { useTransactionStore } from '@/stores/TransactionStore';

const transactionStore = useTransactionStore();
const route = useRoute();
const transaction = computed(() => transactionStore.selected);

const handleSplitClick = async () => {
  await router.push(`/split-create/${transactionStore.selectedId}/friend-selector`);
};

onMounted(async () => {
  const idFromUrl = route.params.transactionId as string | undefined;

  if (idFromUrl) {
    transactionStore.setTransactionId(idFromUrl);
    await transactionStore.fetchTransaction();
  }
});

onBeforeUnmount(async () => {
  transactionStore.$reset();
});
</script>

<template>
  <div>
    <button @click="router.back()" type="button">Back</button>
    <h3>Transaction details:</h3>
    {{ transaction.date }}
    <br />
    {{ transaction.description }}
    <br />
    {{ transaction.amount }}
    <br />
    {{ transaction.note }}
    <button @click="handleSplitClick" type="button">Create split</button>
  </div>
</template>
