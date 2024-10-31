<script setup lang="ts">
import { onBeforeUnmount, reactive } from 'vue';
import { useUserStore } from '@/stores/UserStore';

const form = reactive({
  email: '',
  password: ''
});

const userStore = useUserStore();

onBeforeUnmount(() => {
  userStore.serverError = null;
});
</script>

<template>
  <form @submit.prevent="userStore.login(form)">
    <h2>Login</h2>

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
    <div v-if="userStore.serverError">{{ userStore.serverError }}</div>

    <div>
      <button type="submit">Submit</button>
    </div>

    <RouterLink to="/register">Register</RouterLink>
  </form>
</template>
