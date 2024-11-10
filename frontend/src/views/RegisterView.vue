<script setup lang="ts">
import { computed, onBeforeUnmount, reactive } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseLink from '@/components/BaseLink.vue';

interface FormFields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string | undefined;
  phone: string | undefined;
}

const form = reactive<FormFields>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  middleName: undefined,
  phone: undefined
});

const userStore = useUserStore();

const requiredFields: Array<keyof FormFields> = ['email', 'password', 'firstName', 'lastName'];

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
      <h1 data-test-id="registration-header" class="text-2xl font-medium text-primaryText mb-12">
        Registration
      </h1>

      <div data-test-id="error-message" v-if="userStore.serverError">
        {{ userStore.serverError }}
      </div>
      <form class="w-full">
        <BaseInput
          data-test-id="email-input"
          v-model="form.email"
          placeholder="example@mail.com"
          label="Email"
          name="email"
          class="mb-4"
          :required="isFieldRequired('email')"
        />
        <BaseInput
          data-test-id="password-input"
          v-model="form.password"
          placeholder="******"
          label="Password"
          name="password"
          type="password"
          class="mb-4"
          :required="isFieldRequired('password')"
        />
        <BaseInput
          data-test-id="first-name-input"
          v-model="form.firstName"
          placeholder="John"
          label="First name"
          name="firstName"
          type="text"
          class="mb-4"
          :required="isFieldRequired('firstName')"
        />
        <BaseInput
          data-test-id="middle-name-input"
          v-model="form.middleName"
          placeholder="Justin"
          label="Middle name"
          name="middleName"
          type="text"
          class="mb-4"
          :required="isFieldRequired('middleName')"
        />
        <BaseInput
          data-test-id="last-name-input"
          v-model="form.lastName"
          placeholder="Doe"
          label="Last name"
          name="lastName"
          type="text"
          class="mb-4"
          :required="isFieldRequired('lastName')"
        />
        <BaseInput
          data-test-id="phone-input"
          v-model="form.phone"
          placeholder="9991234567"
          label="Phone"
          name="phone"
          type="text"
          class="mb-4"
          :required="isFieldRequired('phone')"
        />
      </form>

      <BaseButton
        data-test-id="register-button"
        class="block w-full mb-4"
        :disabled="isFormInvalid"
        @click="userStore.register(form)"
        >Submit</BaseButton
      >
      <BaseLink data-test-id="login-link" :to="`/login`">Login</BaseLink>
    </div>
  </div>
</template>
