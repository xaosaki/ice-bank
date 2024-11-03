<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useFriendStore } from '@/stores/FriendStore';

const userStore = useUserStore();
const friendStore = useFriendStore();

const userId = ref('');

const handleCopyIDClick = async () => {
  await navigator.clipboard.writeText(userStore.user.userId);
};

const handleRemoveClick = async (id: string) => {
  await friendStore.remove(id);
  await friendStore.fetchFriends();
};
const handleAddClick = async () => {
  await friendStore.add(userId.value);
  await friendStore.fetchFriends();
  userId.value = '';
};

onMounted(async () => {
  await friendStore.fetchFriends();
});

onBeforeUnmount(async () => {
  friendStore.$reset();
});
</script>

<template>
  <div>
    <h3>Friends:</h3>
    <button @click.prevent="handleCopyIDClick" type="button">Copy my ID</button>
    <br />
    <br />
    <div>
      <label for="userId">UserID*</label>
      <input v-model="userId" type="text" id="userId" name="userId" required />
      <button @click.prevent="handleAddClick" type="button">Add</button>
    </div>

    <h5>Friend list:</h5>
    <ul>
      <li v-for="friend of friendStore.list" :key="friend.userId">
        <span>{{ friend.firstName }} {{ friend.lastName }} {{ friend.email }}</span
        ><button @click.prevent="handleRemoveClick(friend.userId)" type="button">Remove</button>
      </li>
    </ul>
  </div>

  <RouterLink to="/accounts">To accounts</RouterLink>
</template>
