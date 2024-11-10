<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useSplitCreateStore } from '@/stores/SplitCreateStore';
import { useFriendStore } from '@/stores/FriendStore';
import { useTransactionStore } from '@/stores/TransactionStore';
import CompactHeader from '@/components/CompactHeader.vue';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import RichButton from '@/components/RichButton.vue';
import FriendActionItem from '@/components/FriendActionItem.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';

const router = useRouter();
const splitCreateStore = useSplitCreateStore();
const friendStore = useFriendStore();
const transactionStore = useTransactionStore();
const filterText = ref('');

const filteredFriends = computed(() => {
  if (!filterText.value) {
    return friendStore.list;
  }
  const filter = filterText.value.toLowerCase();
  return friendStore.list.filter(
    (friend) =>
      friend.firstName.toLowerCase().includes(filter) ||
      friend.lastName.toLowerCase().includes(filter) ||
      friend.email?.toLowerCase().includes(filter)
  );
});

const toggleFriend = (userId: string) => {
  const isInSplit = splitCreateStore.splitParts.some((part) => part.userId === userId);
  if (isInSplit) {
    splitCreateStore.removeFromSplitPart(userId);
  } else {
    const friend = friendStore.list.find((f) => f.userId === userId);
    if (friend) splitCreateStore.addToSplitPart(friend);
  }
};

onMounted(async () => {
  await friendStore.fetchFriends();
});
</script>
<template>
  <CompactHeader title="People to Share With" />
  <div class="relative pb-28">
    <section class="px-6 pt-8">
      <BaseInput v-model="filterText" name="filter" placeholder="Name / Email" class="mb-4" />
      <RichButton class="w-full mb-4" :icon="faWifi" text="Nearby friends" :disabled="true" />
      <ul>
        <li v-for="friend in filteredFriends" :key="friend.userId">
          <FriendActionItem
            class="mb-4"
            action-type="checkbox"
            :friend="friend"
            :is-checked="splitCreateStore.splitParts.some((part) => part.userId === friend.userId)"
            @checkbox-toggle="toggleFriend"
          />
        </li>
      </ul>
    </section>

    <div
      class="fixed w-full bottom-0 left-0 right-0 px-6 pb-12 pt-6 bg-gradient-to-t from-background via-background via-95% to-transparent md:max-w-5xl md:mx-auto"
    >
      <BaseButton
        data-test-id="next-button"
        class="block w-full"
        @click="router.push(`/split-create/${transactionStore.selectedId}/params`)"
        :disabled="splitCreateStore.partsWithoutMe.length === 0"
        >Next</BaseButton
      >
    </div>
  </div>
</template>
