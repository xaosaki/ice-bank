<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  { disabled: false, label: null, placeholder: '', type: 'text', required: false }
);

const model = defineModel<any>();

const emit = defineEmits(['change']);

const handleChange = () => {
  emit('change', model.value);
};
</script>

<template>
  <div>
    <textarea
      v-model="model"
      class="w-full mb-4 bg-surface h-40 border-none rounded-lg resize-none"
      :name="name"
      :id="name"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="handleChange"
    >
    </textarea>
  </div>
</template>
