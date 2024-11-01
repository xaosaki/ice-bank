<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOutSplitStore } from '@/stores/OutSplitStore';
import { useStatusStore } from '@/stores/StatusStore';

const outSplitsStore = useOutSplitStore();
const statusStore = useStatusStore();
const route = useRoute();
const router = useRouter();

const split = computed(() => outSplitsStore.selected);

const handleCancelClick = async () => {
  await outSplitsStore.cancelSelected();
  statusStore.$patch({
    status: 'OK',
    action: 'Cancel',
    heading: 'Split canceled',
    message: ``,
    next: '/out-splits'
  });
  await router.push(`/status`);
};

onMounted(async () => {
  const idFromUrl = route.params.splitId as string | undefined;

  if (idFromUrl) {
    outSplitsStore.selectedId = idFromUrl;
    await outSplitsStore.fetchSelected();
  }
});

onBeforeUnmount(async () => {
  outSplitsStore.$reset();
});
</script>

<template>
  <div>
    <button @click="router.back()" type="button">Back</button>
    <h3>Outgoing split details:</h3>

    <div v-if="split">
      {{ split.transactionDate }} | {{ split.transactionName }} | {{ split.amount }} <br /><br />
      <li v-for="(group, id) of split.users" :key="id">
        {{ group.status }}
        <ul>
          <li v-for="part of group.users" :key="part.user.userId">
            {{ part.user.firstName }} {{ part.user.email }} | {{ part.amount }} |
            {{ part.comment }}
          </li>
        </ul>
      </li>

      <button v-if="split.status === 'Pending'" @click="handleCancelClick" type="button">
        Cancel split
      </button>
    </div>
  </div>
</template>
