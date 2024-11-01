<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/AccountStore';
import { useTransactionStore } from '@/stores/TransactionStore';

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
    if (newAccountId !== prevAccountId) {
      await accountsStore.loadTransactions();
      await router.push({
        name: 'accounts',
        params: { accountId: accountsStore.selectedAccountId }
      });
    }
  }
);

onMounted(async () => {
  await accountsStore.fetchAccounts();

  const accountIdFromUrl = route.params.accountId as string | undefined;

  if (
    accountIdFromUrl &&
    accountsStore.accounts.some((account) => account.accountId === accountIdFromUrl)
  ) {
    accountsStore.selectAccount(accountIdFromUrl);
  }
});

onBeforeUnmount(async () => {
  accountsStore.selectAccount(null);
});
</script>

<template>
  <div>
    <h1 v-if="userStore.user.userId">Hello, {{ userStore.user.firstName }}</h1>
    <h3>Accounts:</h3>
    <ul>
      <li v-for="account of accountsStore.accounts" :key="account.accountId">
        <span v-if="account.accountId === accountsStore.selectedAccountId">[Active]</span
        ><button @click.prevent="accountsStore.selectAccount(account.accountId)" type="button">
          {{ account.accountId }}: {{ account.balance }}
        </button>
      </li>
    </ul>
    <h3>Transactions for selected account:</h3>
    <button @click="handleGenerateTransactionClick" type="button">Generate transaction</button>
    <ul>
      <li v-for="(group, id) of accountsStore.transactions" :key="id">
        {{ group.date }} | {{ group.totalAmount }}
        <ul>
          <li v-for="transaction of group.transactions" :key="transaction.transactionId">
            <RouterLink :to="`/transactions/${transaction.transactionId}`">
              {{ transaction.date }} | {{ transaction.description }} |
              {{ transaction.amount }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
    <button v-if="userStore.isAuthenticated" type="button" @click="userStore.logout">Logout</button>
  </div>

  <RouterLink to="/out-splits">To outgoing splits</RouterLink>
</template>
