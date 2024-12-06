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
    await fetchy(`/api/friend/accept/${user}`, "PUT");
  } catch (_) {
    return;
  }
}

async function rejectRequest(user: string) {
  try {
    await fetchy(`/api/friend/reject/${user}`, "PUT");
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
      <p>No requests yet!</p>
    </div>
    <div v-else class="loading-text">Loading...</div>
  </div>
</template>

<style scoped>
.friendrequests-list {
  text-align: center;
  font-size: 16px;
  color: #044120;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.friendrequest-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.no-requests {
  color: #044120;
}
.loading-text {
  color: #044120;
}
</style>
