<script setup lang="ts">
import { computed } from 'vue';
import type { SplitPart } from '@/stores/interfaces/SplitCreateInterfaces';
import type { OutSplitUser } from '@/stores/interfaces/OutSplitInterfaces';
import AvatarPro from '@/components/AvatarPro.vue';
import { useUserStore } from '@/stores/UserStore';
import { formatCurrency } from '../utils/FormatCurrency';

const props = withDefaults(
  defineProps<{
    splitPart: SplitPart | OutSplitUser;
    amount?: number | undefined;
    mode: 'edit' | 'danger' | 'normal';
  }>(),
  { amount: 0, mode: 'normal' }
);

const userStore = useUserStore();

const model = defineModel();

const record = computed(() => {
  if ('user' in props.splitPart) {
    return {
      userId: props.splitPart.user.userId,
      firstName: props.splitPart.user.firstName,
      lastName: props.splitPart.user.lastName,
      email: props.splitPart.user.email,
      comment: props.splitPart.comment,
      status: props.splitPart.status
    };
  } else {
    return props.splitPart;
  }
});
</script>

<template>
  <div class="flex items-center justify-between rounded-lg mb-4">
    <div class="flex items-center space-x-4">
      <div class="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center">
        <AvatarPro :first-word="record.firstName" :last-word="record.lastName" />
      </div>

      <div>
        <template v-if="record.userId !== userStore.user.userId">
          <p class="text-primaryText font-semibold">{{ record.firstName }} {{ record.lastName }}</p>
          <p class="text-secondaryText text-sm">{{ record.email }}</p>
        </template>
        <template v-else>
          <p class="text-primaryText font-semibold">You</p>
        </template>
        <p
          v-if="'comment' in record && record.comment"
          class="text-secondaryText mt-1 p-2 rounded bg-surface text-sm"
        >
          {{ record.comment }}
        </p>
      </div>
    </div>

    <div class="flex items-center">
      <input
        data-test-id="split-amount-input"
        v-if="mode === 'edit'"
        type="number"
        step=".01"
        v-model="model"
        class="w-20 p-1 text-primary text-center bg-surfaceHover rounded-lg border-none"
      />
      <p v-else :class="mode === 'danger' ? 'text-danger' : 'text-primaryText'">
        {{ formatCurrency(amount) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
