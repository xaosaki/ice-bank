<script setup lang="ts">
import AvatarPro from '@/components/AvatarPro.vue';
import { computed } from 'vue';
import { formatCurrency } from '@/utils/FormatCurrency';
import { formatDateAndTime, formatDateAndTimeShort } from '@/utils/FormatDate';

const props = withDefaults(
  defineProps<{
    name: string;
    amount: number;
    date: string;
    showSubHeader?: boolean;
    showAmount?: boolean;
  }>(),
  { name: '', amount: 0, date: '', showSubHeader: false, showAmount: true }
);

const words = computed(() => {
  return props.name
    ? props.name.split(' ').filter((item) => item !== '-' && item !== ',')
    : ['', ''];
});
</script>

<template>
  <div>
    <p v-if="showAmount && date" class="text-sm font-semibold mb-3.5">
      {{ formatDateAndTime(date) }}
    </p>
    <div class="mb-5">
      <div class="text-primaryText rounded-lg flex items-center justify-between">
        <div class="flex items-center">
          <AvatarPro class="flex-shrink-0 mr-3" :first-word="words[0]" :last-word="words[1]" />
          <p class="text-xl font-medium mr-4">{{ name }}</p>
        </div>

        <p class="text-primaryText" :class="showAmount ? 'text-2xl' : 'min-w-40 text-right'">
          {{ showAmount ? formatCurrency(amount) : formatDateAndTimeShort(date) }}
        </p>
      </div>
      <p v-if="showSubHeader" class="text-secondaryText font-semibold text-sm mt-2">
        POS transaction
      </p>
    </div>
  </div>
</template>
