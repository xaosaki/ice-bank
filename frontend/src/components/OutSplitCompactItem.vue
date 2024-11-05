<script setup lang="ts">
import { formatCurrency } from '@/utils/FormatCurrency';
import type { SplitByTransaction } from '@/stores/interfaces/TransactionInterfaces';
import BaseLink from '@/components/BaseLink.vue';

defineProps<{
  split: SplitByTransaction;
}>();
</script>

<template>
  <li class="list-item">
    <BaseLink :to="`/out-splits/${split.splitId}`" class="mb-4 flex justify-between items-center">
      <div class="flex items-center">
        <div>
          <div class="font-medium mr-3">
            {{
              split.users.map((user) => user.user.firstName + ' ' + user.user.lastName).join(', ')
            }}
          </div>
        </div>
      </div>
      <span class="text-right min-w-32">
        <span> {{ formatCurrency(split.filledAmount) }} / {{ formatCurrency(split.amount) }}</span>
      </span>
    </BaseLink>
  </li>
</template>
