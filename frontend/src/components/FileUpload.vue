<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const fileInput = ref<any>(null);

const emit = defineEmits(['change']);

const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const uploadFile = async (event: any) => {
  const file = event.target.files[0];
  if (!file) return;
  emit('change', file);
};
</script>

<template>
  <div>
    <button
      data-test-id="upload-file-button"
      class="rounded bg-surface hover:bg-surfaceHover flex justify-center items-center w-16 h-16"
      @click="openFileDialog"
    >
      <font-awesome-icon :icon="faPlus" class="w-5 h-5" />
    </button>
    <input type="file" ref="fileInput" @change="uploadFile" style="display: none" />
  </div>
</template>
