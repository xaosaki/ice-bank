<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';
import { useFriendStore } from '@/stores/FriendStore';
import { useTransactionStore } from '@/stores/TransactionStore';

const router = useRouter();
const splitCreateStore = useSplitCreateStore();
const friendStore = useFriendStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  await friendStore.fetchFriends();
});
</script>
<template>
  <button @click="router.back()" type="button">Back</button>
  <h3>Select friends</h3>
  <ul>
    <li v-for="friend in friendStore.list" :key="friend.userId">
      {{ friend.firstName }}
      <br />
      {{ friend.email }}
      <button
        v-if="splitCreateStore.splitParts.some((part) => part.userId === friend.userId)"
        @click="splitCreateStore.removeFromSplitPart(friend.userId)"
      >
        Remove from split
      </button>
      <button v-else @click="splitCreateStore.addToSplitPart(friend)">Add to split</button>
    </li>
  </ul>

  <RouterLink :to="`/split-create/${transactionStore.selectedId}/params`">Next</RouterLink>
</template>
