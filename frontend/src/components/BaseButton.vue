<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }>(),
  { variant: 'primary', disabled: false, type: 'button' }
);

const emit = defineEmits(['click']);

const variantClass = computed((): string => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-primaryText hover:bg-primaryHover';
    case 'secondary':
      return 'bg-surface text-primaryText hover:bg-surfaceHover';
    case 'danger':
      return 'bg-surface text-danger';
    default:
      return '';
  }
});

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="[
      'px-4 py-4 rounded-lg text-xl font-medium transition duration-200',
      disabled ? 'cursor-not-allowed bg-disabledSurface text-disabledText' : variantClass
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>Button</slot>
  </button>
</template>

<style scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
