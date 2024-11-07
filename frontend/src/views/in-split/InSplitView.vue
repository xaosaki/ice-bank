<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStatusStore } from '@/stores/StatusStore';
import { useInSplitStore } from '@/stores/InSplitStore';
import type { InSplitProcessParams } from '@/stores/interfaces/InSplitInterfaces';
import TransactionHeader from '@/components/TransactionHeader.vue';
import CompactHeader from '@/components/CompactHeader.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTextArea from '@/components/BaseTextArea.vue';
import { formatCurrency } from '@/utils/FormatCurrency';
import BaseSelect, { type BaseSelectOption } from '@/components/BaseSelect.vue';
import { useAccountStore } from '@/stores/AccountStore';
import BaseImage from '@/components/BaseImage.vue';

const inSplitStore = useInSplitStore();
const statusStore = useStatusStore();
const accountStore = useAccountStore();
const route = useRoute();
const router = useRouter();

const split = computed(() => inSplitStore.selected);

const actions = ['accept', 'decline'] as InSplitProcessParams['action'][];

const selectedAccount = ref<BaseSelectOption>();

const accountOptions = computed<BaseSelectOption[]>(() => {
  return accountStore.accounts.map((account) => ({
    value: account.accountId,
    label: `${account.name}: ${formatCurrency(account.balance)}`
  }));
});

watchEffect(() => {
  if (accountOptions.value.length > 0 && !selectedAccount.value) {
    selectedAccount.value = accountOptions.value[0];
  }
});

const handleProcessClick = async (action: InSplitProcessParams['action']) => {
  try {
    await inSplitStore.processSelected({
      action,
      accountId: selectedAccount.value!.value,
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
    await accountStore.fetchAccounts();
  } catch (e: any) {
    statusStore.$patch({
      status: 'Error',
      action: 'Cancel',
      heading: 'Error',
      message: `${e.response?.data?.message || 'An error has occurred. Try again later.'}`,
      next: '/in-splits'
    });
  }

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
      <template v-if="inSplitStore.selectedReceipt">
        <h5 class="text-m font-semibold pb-3">Receipt</h5>
        <BaseImage :url="inSplitStore.selectedReceipt" alt="Receipt" class="mb-4" />
      </template>

      <h5 class="text-m font-semibold pb-3">Account</h5>
      <BaseSelect v-model="selectedAccount" :options="accountOptions" class="mb-4"></BaseSelect>

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
