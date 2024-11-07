<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/TransactionStore';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';
import { useStatusStore } from '@/stores/StatusStore';
import { computed } from 'vue';
import CompactHeader from '@/components/CompactHeader.vue';
import BaseButton from '@/components/BaseButton.vue';
import SplitPartItem from '@/components/SplitPartItem.vue';
import TransactionHeader from '@/components/TransactionHeader.vue';
import BaseLink from '@/components/BaseLink.vue';
import { formatCurrency } from '@/utils/FormatCurrency';
import FileUpload from '@/components/FileUpload.vue';
import BaseImage from '@/components/BaseImage.vue';

const router = useRouter();
const transactionStore = useTransactionStore();
const splitCreateStore = useSplitCreateStore();
const statusStore = useStatusStore();

const isSubmitDisabled = computed(() => {
  return splitCreateStore.sumWithoutMe === 0;
});

const handleChange = (amount: number, userId: string) => {
  const part = splitCreateStore.splitParts.find((p) => p.userId === userId);
  if (part) {
    part.amount = amount < 0 ? 0 : amount;
  }

  splitCreateStore.markSplitPartAsTouched(userId);
  splitCreateStore.rebalanceSplitParts();
};

const handleCreateSplit = async () => {
  try {
    await splitCreateStore.createSplit(transactionStore.selectedId!);
    statusStore.$patch({
      status: 'OK',
      action: 'Done',
      heading: `Request${splitCreateStore.partsWithoutMe.length > 1 ? 's' : ''} sent`,
      next: `/accounts/${transactionStore.selected.accountId!}`,
      message:
        `${splitCreateStore.partsWithoutMe.map((user) => user.firstName).join(', ')}` +
        ` will receive notification${splitCreateStore.partsWithoutMe.length > 1 ? 's' : ''}`
    });
  } catch (e: any) {
    statusStore.$patch({
      status: 'Error',
      action: 'Cancel',
      heading: 'Error',
      message: `${e.response?.data?.message || 'An error has occurred. Try again later.'}`,
      next: `/accounts/${transactionStore.selected.accountId!}`
    });
  }
  await router.push(`/status`);
};
</script>
<template>
  <div v-if="transactionStore.selected" class="relative pb-48">
    <CompactHeader title="Split Details" />
    <section class="px-6 pt-6">
      <TransactionHeader
        :name="transactionStore.selected.description"
        :date="transactionStore.selected.date"
        :amount="transactionStore.selected.amount"
      />
      <h5 class="text-m font-semibold pb-3">Receipt</h5>
      <FileUpload
        v-if="!transactionStore.selected.receipt"
        @change="transactionStore.uploadReceipt"
        class="mb-4"
      />
      <BaseImage
        v-if="transactionStore.selectedReceipt"
        :url="transactionStore.selectedReceipt"
        alt="Receipt"
        :has-remove="true"
        class="mb-4"
        @remove-clicked="transactionStore.deleteReceipt"
      />
      <div class="flex items-center justify-between pb-2">
        <h5 class="text-m font-medium">People</h5>

        <BaseLink :to="`/split-create/${transactionStore.selectedId}/friend-selector`"
          >Change friends</BaseLink
        >
      </div>
      <ul>
        <li v-for="part in splitCreateStore.splitParts" :key="part.userId">
          <SplitPartItem
            :split-part="part"
            mode="edit"
            v-model="part.amount"
            @input="handleChange(part.amount, part.userId)"
            @change="handleChange(part.amount, part.userId)"
          />
        </li>
      </ul>
    </section>

    <div
      class="fixed w-full bottom-0 left-0 right-0 px-6 pb-12 pt-6 bg-gradient-to-t from-background via-background via-95% to-transparent md:max-w-5xl md:mx-auto"
    >
      <BaseButton class="block w-full mb-4" @click="handleCreateSplit" :disabled="isSubmitDisabled">
        {{
          isSubmitDisabled ? 'No receivers' : `Ask ${formatCurrency(splitCreateStore.sumWithoutMe)}`
        }}</BaseButton
      >

      <BaseButton class="block w-full" variant="danger" @click="router.push('/accounts')"
        >Cancel</BaseButton
      >
    </div>
  </div>
</template>
