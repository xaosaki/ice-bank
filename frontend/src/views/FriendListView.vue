<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useFriendStore } from '@/stores/FriendStore';
import NavBar from '@/components/NavBar.vue';
import LargeHeader from '@/components/LargeHeader.vue';
import FriendActionItem from '@/components/FriendActionItem.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const userStore = useUserStore();
const friendStore = useFriendStore();

const userIdOrEmail = ref('');

const handleCopyIDClick = async () => {
  await navigator.clipboard.writeText(userStore.user.userId);
};

const handleRemoveClick = async (id: string) => {
  await friendStore.remove(id);
  await friendStore.fetchFriends();
};
const handleAddClick = async () => {
  await friendStore.add(userIdOrEmail.value);
  await friendStore.fetchFriends();
  userIdOrEmail.value = '';
};

onMounted(async () => {
  await friendStore.fetchFriends();
});

onBeforeUnmount(async () => {
  friendStore.$reset();
});
</script>

<template>
  <div class="pb-20">
    <LargeHeader>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-4xl font-medium">Friends</h3>
        <button type="button" title="Copy my ID" @click="handleCopyIDClick">
          <font-awesome-icon :icon="faCopy" class="w-6 h-6" />
        </button>
      </div>
    </LargeHeader>
    <section class="px-6 pt-8">
      <h5 class="text-m font-semibold mb-4">Add friend:</h5>
      <div class="flex items-end mb-4">
        <BaseInput
          class="w-3/4 mr-4 flex friend-input"
          v-model="userIdOrEmail"
          placeholder="Friend ID"
          name="friendID"
          @keyup.enter="handleAddClick"
        />
        <BaseButton class="w-1/4 py-3.5" :disabled="!userIdOrEmail" @click.prevent="handleAddClick"
          >Add</BaseButton
        >
      </div>

      <h5 class="text-m font-semibold mb-4">Friend list:</h5>
      <ul>
        <li v-for="friend of friendStore.list" :key="friend.userId">
          <FriendActionItem
            class="mb-4"
            action-type="remove"
            :friend="friend"
            @remove-clicked="handleRemoveClick"
          />
        </li>
      </ul>
    </section>
  </div>
  <NavBar></NavBar>
</template>

<style scoped>
.friend-input {
  min-height: 3.75rem;
}
</style>
