<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

withDefaults(
  defineProps<{
    url: string;
    alt: string;
    hasRemove?: boolean;
  }>(),
  { hasRemove: false }
);

const emit = defineEmits(['remove-clicked']);

const isModalOpen = ref(false);

const handleRemoveClick = () => {
  emit('remove-clicked');
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="relative w-16 h-16 flex justify-center items-center border-primary border-2 rounded">
    <img :src="url" class="object-contain w-14 h-14 cursor-pointer" :alt="alt" @click="openModal" />
    <button v-if="hasRemove" class="absolute remove-button" @click="handleRemoveClick">
      <font-awesome-icon
        :icon="faCircleXmark"
        class="w-6 h-6 bg-primaryText rounded-3xl text-disabledSurface hover:text-secondaryText text-2xl"
      />
    </button>

    <teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div class="relative rounded shadow-lg p-4 py-8">
          <button @click="closeModal" class="absolute large-cross p-2">
            <font-awesome-icon
              :icon="faCircleXmark"
              class="w-10 h-10 bg-primaryText rounded-3xl border-2 border-primaryText text-background text-4xl"
            />
          </button>
          <img :src="url" alt="Receipt Image" class="large-image" />
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.remove-button {
  top: -0.75rem;
  right: -0.75rem;
}

.large-cross {
  top: 0;
  right: -0.75rem;
}

.large-image {
  max-height: 90vh;
  max-width: 90vw;
}
</style>
