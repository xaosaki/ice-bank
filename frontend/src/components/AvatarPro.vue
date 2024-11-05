<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    imageSrc?: string;
    firstWord: string;
    lastWord: string;
  }>(),
  { imageSrc: '' }
);

const initials = computed(() => {
  const firstInitial = props.firstWord ? props.firstWord[0].toUpperCase() : '';
  const lastInitial = props.lastWord ? props.lastWord[0].toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
});

const avatarStyle = computed(() => {
  if (!props.imageSrc) {
    return {
      backgroundColor: generateRandomColor()
    };
  }
  return {};
});

const generateRandomColor = () => {
  const hash = [...(props.firstWord || '' + props.lastWord || '')].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const hue = hash % 360;
  return `hsl(${hue},  ${props.firstWord === '' ? '0%' : '70%'}, 50%)`;
};
</script>

<template>
  <div
    class="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold"
    :style="avatarStyle"
  >
    <template v-if="imageSrc">
      <img :src="imageSrc" alt="Avatar" class="w-full h-full object-cover rounded-full" />
    </template>
    <template v-else>
      <span>{{ initials }}</span>
    </template>
  </div>
</template>
