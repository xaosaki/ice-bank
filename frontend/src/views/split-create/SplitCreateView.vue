<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';
import type { Friend } from '@/stores/interfaces/FriendInterfaces';
import { useTransactionStore } from '@/stores/TransactionStore';

const splitCreateStore = useSplitCreateStore();
const transactionStore = useTransactionStore();
const userStore = useUserStore();
const route = useRoute();

onMounted(async () => {
  const idFromUrl = route.params.transactionId as string | undefined;

  if (idFromUrl) {
    transactionStore.selectedId = idFromUrl;
    await transactionStore.fetchTransaction().then(() => {
      splitCreateStore.total = transactionStore.selected.amount;
    });
  }

  splitCreateStore.currentUserId = userStore.user.userId;
  splitCreateStore.addToSplitPart(userStore.user as Friend);
});

onBeforeUnmount(async () => {
  transactionStore.$reset();
  splitCreateStore.$reset();
});
</script>

<template>
  <RouterView></RouterView>
</template>
