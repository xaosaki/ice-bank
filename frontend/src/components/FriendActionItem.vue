<script setup lang="ts">
import type { Friend } from '@/stores/interfaces/FriendInterfaces';
import AvatarPro from '@/components/AvatarPro.vue';

const props = withDefaults(
  defineProps<{
    friend: Friend;
    isChecked?: boolean;
    actionType: 'checkbox' | 'remove';
  }>(),
  { isChecked: false }
);

const emit = defineEmits(['checkbox-toggle', 'remove-clicked']);

const handleAction = () => {
  if (props.actionType === 'checkbox') {
    emit('checkbox-toggle', props.friend.userId);
  }
};

const handleRemoveFriend = () => {
  emit('remove-clicked', props.friend.userId);
};
</script>

<template>
  <button
    data-test-id="friend-action-button"
    @click="handleAction"
    class="w-full flex items-center justify-between p-4 bg-surface rounded-lg"
    :class="actionType === 'checkbox' ? 'cursor-pointer' : 'cursor-default'"
  >
    <div class="flex items-center space-x-4">
      <AvatarPro :first-word="friend.firstName" :last-word="friend.lastName" />

      <div class="flex flex-col items-start">
        <p class="text-primaryText font-semibold">{{ friend.firstName }} {{ friend.lastName }}</p>
        <p class="text-secondaryText text-sm">{{ friend.email }}</p>
      </div>
    </div>

    <div v-if="actionType === 'checkbox'">
      <div class="w-5 h-5 border-2 rounded flex items-center justify-center border-secondaryText">
        <div v-if="isChecked" class="w-3.5 h-3.5 rounded bg-primary"></div>
      </div>
    </div>

    <div v-else-if="actionType === 'remove'">
      <button
        data-test-id="remove-friend-button"
        @click.stop="handleRemoveFriend"
        class="text-danger w-8 h-8 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </button>
</template>
