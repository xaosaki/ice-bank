<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStatusStore } from '@/stores/StatusStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import type { InSplitProcessParams } from '@/stores/interfaces/InSplitInterfaces';
import TransactionHeader from '@/components/TransactionHeader.vue';
import CompactHeader from '@/components/CompactHeader.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTextArea from '@/components/BaseTextArea.vue';
import { formatCurrency } from '../../utils/FormatCurrency';

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
    heading:
      action === 'accept'
        ? `${formatCurrency(split.value?.amountForPay || 0)} was sent`
        : 'Split declined',
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
  <div v-if="split" class="relative pb-44">
    <CompactHeader title="Incoming Split Details" />
    <section class="px-6 pt-6">
      <div class="text-center mb-4">
        <span class="rounded-xl bg-surface px-4 py-2">Status: {{ split.splitStatus }}</span>
      </div>
      <h5 class="text-m font-semibold mb-4">Receiver</h5>
      <div class="text-3xl font-medium">
        {{ split.fromUser.firstName }} {{ split.fromUser.lastName }}
      </div>
      <div class="text-sm text-secondaryText mb-6">{{ split.fromUser.email }}</div>
      <h5 class="text-m font-semibold mb-4">Amount</h5>
      <div class="text-3xl mb-6">{{ formatCurrency(split.amountForPay) }}</div>

      <h5 class="text-m font-semibold pb-3">Transaction details</h5>
      <TransactionHeader
        :name="split.transactionName"
        :date="split.transactionDate"
        :amount="split.amountForPay"
        :show-amount="false"
      />

      <h5 class="text-m font-semibold pb-3">Comment</h5>
      <BaseTextArea
        v-model="split.comment"
        name="comment"
        :placeholder="
          split.answerStatus === 'Pending' ? `Few words for ${split.fromUser.firstName}...` : ''
        "
        :disabled="split.answerStatus !== 'Pending'"
      />
    </section>

    <div
      v-if="split.answerStatus === 'Pending'"
      class="fixed w-full bottom-0 left-0 right-0 px-6 pb-12 md:max-w-5xl pt-6 bg-gradient-to-t from-background via-background via-95% to-transparent md:mx-auto"
    >
      <BaseButton class="block w-full mb-4" @click="handleProcessClick(actions[0])">
        Pay now</BaseButton
      >

      <BaseButton class="block w-full" variant="danger" @click="handleProcessClick(actions[1])"
        >Decline split</BaseButton
      >
    </div>
  </div>
</template>
