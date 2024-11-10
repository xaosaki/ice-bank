<script setup lang="ts">
import { computed } from 'vue';
import type { Account } from '@/stores/interfaces/AccountInterfaces';
import { useAccountStore } from '@/stores/AccountStore';
import { formatCurrency } from '@/utils/FormatCurrency';

const accountStore = useAccountStore();

const currentAccountIndex = computed(() =>
  accountStore.accounts.findIndex((account) => account.accountId === accountStore.selectedAccountId)
);
const currentAccount = computed(() => accountStore.accounts[currentAccountIndex.value] || null);
const previousAccount = computed(
  () => accountStore.accounts[currentAccountIndex.value - 1] || null
);
const nextAccount = computed(() => accountStore.accounts[currentAccountIndex.value + 1] || null);

const handleChangeAccountClick = (id: Account['accountId']) => {
  accountStore.selectAccount(id);
};
</script>

<template>
  <div data-test-id="account-balance" v-if="currentAccount" class="text-4xl font-bold mb-6">
    {{ formatCurrency(currentAccount.balance) }}
  </div>

  <div class="grid grid-cols-[1fr_3fr_1fr] gap-4 account-selector mt-auto">
    <div class="flex items-end">
      <button
        data-test-id="previous-account"
        v-if="previousAccount"
        @click="handleChangeAccountClick(previousAccount.accountId)"
        class="px-2 py-1 bg-primary w-full text-white rounded-tr-lg"
      >
        {{ previousAccount.name }}
      </button>
      <div v-else class="w-full"></div>
    </div>

    <div
      data-test-id="current-account"
      v-if="currentAccount"
      class="pt-2 pb-4 px-4 bg-primary text-primaryText rounded-t-lg font-semibold"
    >
      {{ currentAccount.name }}
    </div>

    <div class="flex items-end">
      <button
        data-test-id="next-account"
        v-if="nextAccount"
        @click="handleChangeAccountClick(nextAccount.accountId)"
        class="px-2 py-1 bg-primary w-full text-black rounded-tl-lg"
      >
        {{ nextAccount.name }}
      </button>
      <div v-else class="w-full"></div>
    </div>
  </div>
</template>

<style scoped>
.account-selector {
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}
</style>
