<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'danger';
    to: string;
  }>(),
  { variant: 'primary' }
);

const variantClass = computed((): string => {
  switch (props.variant) {
    case 'danger':
      return 'text-danger hover:text-dangerHover';
    default:
      return 'text-primary hover:text-primaryHover';
  }
});
</script>

<template>
  <RouterLink :class="['font-medium', variantClass]" :to="to"><slot></slot></RouterLink>
</template>
