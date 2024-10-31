<script setup lang="ts">
import { onBeforeUnmount, reactive } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const form = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  middleName: undefined,
  phone: undefined
});

const userStore = useUserStore();

onBeforeUnmount(() => {
  userStore.serverError = null;
});
</script>

<template>
  <form @submit.prevent="userStore.register(form)">
    <h2>Registration</h2>

    <div>
      <label for="email">Email*</label>
      <input
        v-model="form.email"
        type="text"
        id="email"
        name="email"
        placeholder="example@mail.com"
        required
      />
    </div>
    <div>
      <label for="password">Password*</label>
      <input
        v-model="form.password"
        type="password"
        id="password"
        name="password"
        placeholder="********"
        required
      />
    </div>
    <div>
      <label for="fistName">First name*</label>
      <input
        v-model="form.firstName"
        type="text"
        id="firstName"
        name="firstName"
        placeholder="John"
        required
      />
    </div>
    <div>
      <label for="middleName">Middle name</label>
      <input
        v-model="form.middleName"
        type="text"
        id="middleName"
        name="middleName"
        placeholder="Jake"
      />
    </div>
    <div>
      <label for="lastName">Last name*</label>
      <input
        v-model="form.lastName"
        type="text"
        id="lastName"
        name="lastName"
        placeholder="Doe"
        required
      />
    </div>
    <div>
      <label for="phone">Phone</label>
      <input v-model="form.phone" type="number" id="phone" name="phone" placeholder="9991234567" />
    </div>
    <div v-if="userStore.serverError">{{ userStore.serverError }}</div>

    <div>
      <button type="submit">Submit</button>
    </div>

    <RouterLink to="/login">Login</RouterLink>
  </form>
</template>
