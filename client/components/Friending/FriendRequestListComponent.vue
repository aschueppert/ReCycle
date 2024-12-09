<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const friendRequests = ref<Array<Record<string, string>>>([]);

async function getFriendRequests() {
  let friendRequestResults;
  try {
    friendRequestResults = await fetchy(`/api/friend/pendingRequests`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  friendRequests.value = friendRequestResults;
}

async function acceptRequest(user: string) {
  try {
    await fetchy(`/api/friend/accept/${user}`, "PUT", { alert: true });
    friendRequests.value = friendRequests.value.filter((request) => request.from !== user);
  } catch (_) {
    return;
  }
}

async function rejectRequest(user: string) {
  try {
    await fetchy(`/api/friend/reject/${user}`, "PUT", { alert: true });
    friendRequests.value = friendRequests.value.filter((request) => request.from !== user);
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  await getFriendRequests();
  loaded.value = true;
});
</script>

<template>
  <div class="friendrequests-list">
    <div v-if="loaded && friendRequests.length !== 0">
      <ul class="friendrequest-items">
        <li v-for="friendRequest in friendRequests" :key="friendRequest._id">
          <span class="request-name">{{ friendRequest.from }}</span>
          <div class="request-buttons">
            <button class="button" @click="acceptRequest(friendRequest.from)">Accept</button>
            <button class="button" @click="rejectRequest(friendRequest.from)">Reject</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else-if="loaded" class="no-requests">
      <p>No requests at the moment!</p>
    </div>
    <div v-else class="loading-text">Loading...</div>
  </div>
</template>

<style scoped>
.friendrequests-list {
  font-family: var(--base-font);
  text-align: center;
  font-size: 16px;
  color: #044120;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.friendrequest-items {
  font-family: var(--base-font);
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.friendrequest-items li {
  font-family: var(--base-font);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.request-name {
  font-family: var(--base-font);
  text-align: left;
  flex: 1; /* Take up the remaining space */
}

.request-buttons {
  font-family: var(--base-font);
  display: flex;
  gap: 10px; /* Small gap between buttons */
}

.no-requests {
  font-family: var(--base-font);
  color: #044120;
}

.loading-text {
  font-family: var(--base-font);
  color: #044120;
}
</style>
