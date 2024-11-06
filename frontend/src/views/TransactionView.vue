<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/Router';
import { useTransactionStore } from '@/stores/TransactionStore';
import RichButton from '@/components/RichButton.vue';
import { faArrowLeft, faHandHoldingDollar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import LargeHeader from '@/components/LargeHeader.vue';
import TransactionHeader from '@/components/TransactionHeader.vue';
import BaseTextArea from '@/components/BaseTextArea.vue';
import OutSplitCompactItem from '@/components/OutSplitCompactItem.vue';
import FileUpload from '@/components/FileUpload.vue';
import BaseImage from '@/components/BaseImage.vue';

const transactionStore = useTransactionStore();
const route = useRoute();
const transaction = computed(() => transactionStore.selected);

const handleCreateSplitClick = async () => {
  await router.push(`/split-create/${transactionStore.selectedId}/friend-selector`);
};

onMounted(async () => {
  const idFromUrl = route.params.transactionId as string | undefined;

  if (idFromUrl) {
    transactionStore.setTransactionId(idFromUrl);
    await transactionStore.fetchTransaction();
    await transactionStore.fetchSplitsByTransaction();
  }
});

onBeforeUnmount(async () => {
  transactionStore.$reset();
});
</script>

<template>
  <LargeHeader class="relative">
    <button
      @click="router.back()"
      class="absolute left-5 top-13 flex justify-center content-center text-primaryText w-6 h-6 text-2xl"
      type="button"
    >
      <font-awesome-icon :icon="faArrowLeft" />
    </button>
    <TransactionHeader
      :name="transaction.description"
      :date="transaction.date"
      :amount="transaction.amount"
      :show-sub-header="true"
      class="pt-10"
    />
  </LargeHeader>
  <section class="px-6 pt-8">
    <h5 class="text-m font-semibold pb-3">Category</h5>
    <RichButton
      class="w-full mb-4"
      :icon="faUtensils"
      :text="transaction.category"
      sub-text="Change Category"
      :disabled="true"
    />
    <h5 class="text-m font-semibold pb-3">Receipt</h5>
    <FileUpload v-if="!transaction.receipt" @change="transactionStore.uploadReceipt" class="mb-4" />
    <BaseImage
      v-if="transactionStore.selectedReceipt"
      :url="transactionStore.selectedReceipt"
      alt="Receipt"
      :has-remove="true"
      class="mb-4"
      @remove-clicked="transactionStore.deleteReceipt"
    />
    <h5 class="text-m font-semibold pb-3">Splits</h5>
    <ul>
      <OutSplitCompactItem
        v-for="split in transactionStore.splitsBySelected"
        :split="split"
        :key="split.splitId"
      />
    </ul>
    <RichButton
      class="w-full mb-4"
      :icon="faHandHoldingDollar"
      :text="'Split this bill ' + (transactionStore.splitsBySelected.length ? ' (again)' : '')"
      sub-text="Instantly get paid back by your friends"
      @click="handleCreateSplitClick"
    />
    <h5 class="text-m font-semibold pb-3">Notes</h5>
    <BaseTextArea v-model="transaction.note" name="note" :disabled="true" />
  </section>
</template>
