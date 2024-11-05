<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: any;
    text: string;
    subText?: string;
    disabled?: boolean;
  }>(),
  { icon: null, text: '', subText: '', disabled: false }
);

const emit = defineEmits(['click']);

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="[
      'flex items-center p-4 rounded-lg transition',
      disabled ? 'bg-disabledSurface cursor-not-allowed' : 'bg-surface hover:bg-surfaceHover'
    ]"
    type="button"
    @click="handleClick"
  >
    <span
      :class="[
        'w-10 h-10 rounded-lg  flex items-center justify-center mr-4',
        disabled ? 'bg-disabledText' : 'bg-primary'
      ]"
    >
      <font-awesome-icon v-if="icon" :icon="icon" class="text-oppositeText text-2xl" />
    </span>

    <span class="flex flex-col items-start">
      <span
        :class="[disabled ? 'text-secondaryText' : 'text-primaryText']"
        class="font-semibold text-m"
      >
        {{ text }}
      </span>
      <span class="text-secondaryText text-xs">{{ subText }}</span>
    </span>
  </button>
</template>

<style></style>
