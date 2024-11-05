<script setup lang="ts">
import { computed, onBeforeUnmount, reactive } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseLink from '@/components/BaseLink.vue';

interface FormFields {
  email: string;
  password: string;
}

const form = reactive({
  email: '',
  password: ''
});

const userStore = useUserStore();

const requiredFields: Array<keyof FormFields> = ['email', 'password'];

const isFieldRequired = (field: keyof FormFields) => {
  return requiredFields.includes(field);
};

const isFormInvalid = computed(() => {
  return requiredFields.some((field) => !form[field]);
});

onBeforeUnmount(() => {
  userStore.serverError = null;
});
</script>

<template>
  <div class="flex flex-col items-center justify-between min-h-screen p-6 bg-background">
    <div class="mt-14 w-full md:w-96 flex flex-col items-center">
      <h1 class="text-2xl font-medium text-primaryText mb-12">Login</h1>

      <div v-if="userStore.serverError">{{ userStore.serverError }}</div>
      <form class="w-full">
        <BaseInput
          v-model="form.email"
          placeholder="example@mail.com"
          label="Email"
          name="email"
          class="mb-4"
          :required="isFieldRequired('email')"
        />
        <BaseInput
          v-model="form.password"
          placeholder="******"
          label="Password"
          name="password"
          type="password"
          class="mb-4"
          :required="isFieldRequired('password')"
        />
      </form>

      <BaseButton class="block w-full mb-4" :disabled="isFormInvalid" @click="userStore.login(form)"
        >Submit</BaseButton
      >
      <BaseLink :to="`/register`">Register</BaseLink>
    </div>
  </div>
</template>
