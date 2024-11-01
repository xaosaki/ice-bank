<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/TransactionStore';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';
import { useStatusStore } from '@/stores/StatusStore';
import { computed } from 'vue';

const router = useRouter();
const transactionStore = useTransactionStore();
const splitCreateStore = useSplitCreateStore();
const statusStore = useStatusStore();

const submitDisabled = computed(() => {
  return splitCreateStore.sumWithoutMe === 0;
});

const handleChange = (userId: string) => {
  const part = splitCreateStore.splitParts.find((p) => p.userId === userId);
  if (part && part.amount < 0) {
    part.amount = 0;
  }
  splitCreateStore.markSplitPartAsTouched(userId);
  splitCreateStore.rebalanceSplitParts();
};

const handleCreateSplit = async () => {
  await splitCreateStore.createSplit(transactionStore.selectedId!);
  statusStore.$patch({
    status: 'OK',
    action: 'Done',
    heading: 'Requests sent',
    message: `${splitCreateStore.partsWithoutMe.map((user) => user.firstName).join(', ')} will receive notifications`
  });
  await router.push(`/status`);
};
</script>
<template>
  <button @click="router.back()" type="button">Back</button>
  <h3>Create split details</h3>

  {{ transactionStore.selected.date }} | {{ transactionStore.selected.description }} |
  {{ transactionStore.selected.amount }}

  <br />
  <br />

  <RouterLink :to="`/split-create/${transactionStore.selectedId}/friend-selector`"
    >Edit friends</RouterLink
  >
  <br />
  <ul>
    <li v-for="(part, index) in splitCreateStore.splitParts" :key="part.userId">
      {{ part.firstName }}
      <br />
      {{ part.email }}
      <input
        v-model="part.amount"
        @change="handleChange(part.userId)"
        type="number"
        :id="`${index}-number`"
        name="${index}-number"
      />
    </li>
  </ul>

  <button @click="handleCreateSplit" type="button" :disabled="submitDisabled">
    Ask {{ splitCreateStore.sumWithoutMe }}
  </button>

  <br />
  <br />

  <RouterLink to="/accounts">Cancel</RouterLink>
</template>
