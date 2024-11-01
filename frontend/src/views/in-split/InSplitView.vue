<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStatusStore } from '@/stores/StatusStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import type { InSplitProcessParams } from '@/stores/interfaces/InSplitInterfaces';

const inSplitStore = useInSplitStore();
const statusStore = useStatusStore();
const route = useRoute();
const router = useRouter();

const split = computed(() => inSplitStore.selected);

const actions = ['accept', 'decline'] as InSplitProcessParams['action'][];

const handleProcessClick = async (action: InSplitProcessParams['action']) => {
  await inSplitStore.processSelected({
    action,
    comment: inSplitStore.selected?.comment || null
  });
  statusStore.$patch({
    status: 'OK',
    action: action === 'accept' ? 'Done' : 'Cancel',
    heading: action === 'accept' ? `$${split.value?.amountForPay} was sent` : 'Split declined',
    message: `${split.value?.fromUser?.firstName} will be notified`,
    next: '/in-splits'
  });
  await router.push(`/status`);
};

onMounted(async () => {
  const idFromUrl = route.params.splitId as string | undefined;

  if (idFromUrl) {
    inSplitStore.selectedId = idFromUrl;
    await inSplitStore.fetchSelected();
  }
});

onBeforeUnmount(async () => {
  inSplitStore.$reset();
});
</script>

<template>
  <div>
    <button @click="router.back()" type="button">Back</button>
    <h3>Incoming split details:</h3>

    <div v-if="split">
      {{ split.transactionDate }} | {{ split.transactionName }} | {{ split.amountForPay }}
      <br /><br />

      <div>
        <label for="comment">Comment</label>
        <input
          v-model="split.comment"
          type="text"
          id="comment"
          name="comment"
          :placeholder="
            split.answerStatus === 'Pending' ? `Few words for ${split.fromUser.firstName}...` : ''
          "
          :disabled="split.answerStatus !== 'Pending'"
        />
      </div>

      <div v-if="split.answerStatus === 'Pending'">
        <button @click="handleProcessClick(actions[0])" type="button">Pay now</button>
        <button @click="handleProcessClick(actions[1])" type="button">Decline split</button>
      </div>
    </div>
  </div>
</template>
