<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export interface BaseSelectOption {
  value: any;
  label: any;
}

const model = defineModel<BaseSelectOption>();

withDefaults(
  defineProps<{
    options: BaseSelectOption[];
    label?: string | null;
  }>(),
  { label: null }
);
</script>

<template>
  <div>
    <label v-if="label" class="block pb-2 text-primaryText" for="custom-select">{{ label }}</label>
    <Listbox v-model="model">
      <div class="relative mt-1">
        <ListboxButton
          v-slot="{ open }"
          class="relative w-full bg-surface rounded-lg bg-white px-4 py-4 pr-10 text-left shadow-md cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-opacity-75"
        >
          <span class="block truncate">{{ model?.label || 'Select one' }}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer">
            <font-awesome-icon :icon="open ? faChevronUp : faChevronDown" aria-hidden="true" />
          </span>
        </ListboxButton>
        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md outline-2 outline-background bg-surface py-1 text-base shadow-lg ring-1 ring-ring ring-opacity-5"
          >
            <ListboxOption
              v-slot="{ selected }"
              v-for="(option, index) in options"
              :key="index"
              :value="option"
              class="cursor-pointer relative py-4 pl-4 pr-10 hover:bg-surfaceHover ui-active:bg-surfaceHover"
            >
              <font-awesome-icon
                v-if="selected"
                :icon="faCheck"
                aria-hidden="true"
                class="absolute right-4 top-5"
              />
              <span class="block truncate">
                {{ option.label }}
              </span>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
