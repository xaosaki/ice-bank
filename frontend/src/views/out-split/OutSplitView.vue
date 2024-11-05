<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOutSplitStore } from '@/stores/OutSplitStore';
import { useStatusStore } from '@/stores/StatusStore';
import TransactionHeader from '@/components/TransactionHeader.vue';
import CompactHeader from '@/components/CompactHeader.vue';
import BaseButton from '@/components/BaseButton.vue';
import SplitPartItem from '@/components/SplitPartItem.vue';
import BaseLink from '@/components/BaseLink.vue';

const outSplitsStore = useOutSplitStore();
const statusStore = useStatusStore();
const route = useRoute();
const router = useRouter();

const split = computed(() => outSplitsStore.selected);

const handleCancelClick = async () => {
  await outSplitsStore.cancelSelected();
  statusStore.$patch({
    status: 'OK',
    action: 'Cancel',
    heading: 'Split canceled',
    message: ``,
    next: '/out-splits'
  });
  await router.push(`/status`);
};

onMounted(async () => {
  const idFromUrl = route.params.splitId as string | undefined;

  if (idFromUrl) {
    outSplitsStore.selectedId = idFromUrl;
    await outSplitsStore.fetchSelected();
  }
});

onBeforeUnmount(async () => {
  outSplitsStore.$reset();
});
</script>

<template>
  <div v-if="split" class="relative pb-28">
    <CompactHeader title="Outgoing Split Details" />
    <section v-if="outSplitsStore.selected" class="px-6 pt-6">
      <div class="text-center mb-8">
        <span class="rounded-xl bg-surface px-4 py-2"
          >Status: {{ outSplitsStore.selected.status }}</span
        >
      </div>
      <TransactionHeader
        :name="outSplitsStore.selected.transactionName"
        :date="outSplitsStore.selected.transactionDate"
        :amount="outSplitsStore.selected.amount"
        class="mb-4"
      />
      <BaseLink
        class="block mb-6"
        text="Transaction details"
        :to="`/transactions/${outSplitsStore.selected.transactionId}`"
      />
      <ul>
        <li v-for="(group, id) of split.usersGrouped" :key="id" class="mb-6">
          <div
            class="flex justify-between items-center text-primaryText text-sm font-semibold mb-2"
          >
            {{ group.status }}
          </div>
          <ul>
            <li v-for="part of group.users" :key="part.user.userId">
              <SplitPartItem :split-part="part" mode="normal" :amount="part.amount" />
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <div
      class="fixed w-full bottom-0 left-0 right-0 px-6 pb-12 pt-6 bg-gradient-to-t from-background via-background via-95% to-transparent md:max-w-5xl md:mx-auto"
    >
      <BaseButton
        class="block w-full"
        variant="danger"
        v-if="split.status === 'Pending'"
        @click="handleCancelClick"
        >Cancel split</BaseButton
      >
    </div>
  </div>
</template>
