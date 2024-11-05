<script setup lang="ts">
import type { AccountTransaction } from '@/stores/interfaces/AccountInterfaces';
import type { InSplit } from '@/stores/interfaces/InSplitInterfaces';
import type { OutSplit } from '@/stores/interfaces/OutSplitInterfaces';
import { computed } from 'vue';
import AvatarPro from '@/components/AvatarPro.vue';
import { formatCurrency } from '@/utils/FormatCurrency';
import { formatDateAndTime } from '@/utils/FormatDate';

const props = defineProps<{
  transaction: AccountTransaction | InSplit | OutSplit;
  type: 'in-split' | 'out-split' | 'account';
}>();

const details = computed(() => {
  let id = (props.transaction as OutSplit | InSplit).splitId;
  let path = '/out-splits';
  let heading = (props.transaction as OutSplit | InSplit).transactionName;
  let subHeading = (props.transaction as OutSplit | InSplit).transactionDate;
  let amount = (props.transaction as OutSplit).amount;
  if (props.type === 'account') {
    id = (props.transaction as AccountTransaction).transactionId;
    path = '/transactions';
    heading = (props.transaction as AccountTransaction).description;
    subHeading = (props.transaction as AccountTransaction).category;
  } else if (props.type === 'in-split') {
    path = '/in-splits';
    amount = (props.transaction as InSplit).amountForPay;
  }

  return { heading, subHeading, link: `${path}/${id}`, amount };
});

const words = computed(() => {
  return details.value.heading.split(' ').filter((item) => item !== '-' && item !== ',');
});
</script>

<template>
  <li class="list-item">
    <RouterLink
      :to="details.link"
      class="flex justify-between items-center hover:bg-surface px-6 pb-2 pt-2"
    >
      <div class="flex items-center">
        <AvatarPro class="flex-shrink-0 mr-4" :first-word="words[0]" :last-word="words[1]" />
        <div>
          <div class="text-primaryText font-medium mr-4">
            {{ details.heading }}
          </div>
          <div class="text-secondaryText text-sm">
            {{ type === 'account' ? details.subHeading : formatDateAndTime(details.subHeading) }}
          </div>
        </div>
      </div>
      <span class="text-right" :class="'filledAmount' in transaction ? 'min-w-32' : ''">
        <span>{{
          'filledAmount' in transaction ? formatCurrency(transaction.filledAmount) + ' / ' : ''
        }}</span>
        <span class="text-xl">{{ formatCurrency(details.amount) }}</span>
      </span>
    </RouterLink>
  </li>
</template>

<style scoped>
.list-item {
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}
</style>
