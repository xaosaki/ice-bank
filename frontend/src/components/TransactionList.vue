<script setup lang="ts">
import type { AccountTransactionGroup } from '@/stores/interfaces/AccountInterfaces';
import TransactionItem from '@/components/TransactionItem.vue';
import type { InSplitGroup } from '@/stores/interfaces/InSplitInterfaces';
import type { OutSplitGroup } from '@/stores/interfaces/OutSplitInterfaces';
import { formatCurrency } from '@/utils/FormatCurrency';
import { formatDayDate } from '@/utils/FormatDate';

defineProps<{
  transactions: AccountTransactionGroup[] | InSplitGroup[] | OutSplitGroup[];
  type: 'in-split' | 'out-split' | 'account';
}>();
</script>

<template>
  <div class="transaction-list">
    <ul data-test-id="transaction-list">
      <li v-for="(group, id) in transactions" :key="id" class="mb-6">
        <div class="flex justify-between items-center text-primaryText text-sm font-semibold mb-2">
          <span>{{ 'date' in group ? formatDayDate(group.date) : group.status }}</span>
          <span>{{ 'totalAmount' in group ? formatCurrency(group.totalAmount) : '' }}</span>
        </div>

        <ul>
          <TransactionItem
            v-for="transaction in 'transactions' in group ? group.transactions : group.splits"
            :key="'transactionId' in transaction ? transaction.transactionId : transaction.splitId"
            :transaction="transaction"
            :type="type"
          />
        </ul>
      </li>
    </ul>
  </div>
</template>
