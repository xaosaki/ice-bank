<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/AccountStore';
import { useTransactionStore } from '@/stores/TransactionStore';
import NavBar from '@/components/NavBar.vue';
import TransactionList from '@/components/TransactionList.vue';
import BaseButton from '@/components/BaseButton.vue';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import AccountOverview from '@/components/AccountOverview.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LargeHeader from '@/components/LargeHeader.vue';

const userStore = useUserStore();
const accountsStore = useAccountStore();
const transactionStore = useTransactionStore();
const route = useRoute();
const router = useRouter();

const handleGenerateTransactionClick = async () => {
  await transactionStore.generateTransaction(accountsStore.selectedAccountId!);
  await accountsStore.loadTransactions();
};

watch(
  () => accountsStore.selectedAccountId,
  async (newAccountId, prevAccountId) => {
    if (newAccountId && newAccountId !== prevAccountId) {
      await accountsStore.loadTransactions();
      await router.push({
        name: 'accounts',
        params: { accountId: accountsStore.selectedAccountId }
      });
    }
  }
);

const checkAccountsAndUrl = async () => {
  const accountIdFromUrl = route.params.accountId as string | undefined;

  if (
    accountIdFromUrl &&
    accountsStore.accounts.some((account) => account.accountId === accountIdFromUrl)
  ) {
    accountsStore.selectAccount(accountIdFromUrl);
  } else if (accountIdFromUrl === '' && accountsStore.accounts.length) {
    accountsStore.selectAccount(accountsStore.accounts[0].accountId);
  }
};

watch(
  () => accountsStore.accounts,
  async (_, prevAccounts) => {
    if (!prevAccounts.length) {
      await checkAccountsAndUrl();
    }
  }
);

onMounted(checkAccountsAndUrl);

onBeforeUnmount(async () => {
  accountsStore.selectAccount(null);
});
</script>

<template>
  <div class="pb-20">
    <LargeHeader>
      <div class="flex justify-between items-center mb-4">
        <div class="text-lg">👋 Hey {{ userStore.user.firstName }}!</div>
        <!--          <font-awesome-icon :icon="faCog" class="text-primaryText w-5 h-5" />-->
        <button
          data-test-id="logout-button"
          v-if="userStore.isAuthenticated"
          type="button"
          @click="userStore.logout"
        >
          <font-awesome-icon :icon="faRightFromBracket" class="w-6 h-6" />
        </button>
      </div>
      <AccountOverview v-if="accountsStore.accounts.length" />
    </LargeHeader>
    <section class="px-6 pt-8">
      <BaseButton
        data-test-id="generate-transaction"
        @click="handleGenerateTransactionClick"
        variant="secondary"
        class="w-full mb-4"
        >Generate transaction</BaseButton
      >
      <TransactionList :transactions="accountsStore.transactions" type="account" />
    </section>
  </div>
  <NavBar></NavBar>
</template>
