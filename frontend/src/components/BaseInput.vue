<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    required?: boolean;
    type?: string;
    placeholder?: string;
    label?: string | null;
    disabled?: boolean;
  }>(),
  { disabled: false, label: null, placeholder: '', type: 'text', required: false }
);

const model = defineModel();
</script>

<template>
  <div>
    <label v-if="label" class="block pb-2" :for="name"
      >{{ label }} <span v-if="required">*</span></label
    >
    <input
      v-model="model"
      class="w-full text-primaryText px-4 py-4 bg-surface border-none rounded-lg"
      :name="name"
      :id="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>
