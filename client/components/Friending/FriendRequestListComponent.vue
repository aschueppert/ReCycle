<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

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
      <ul class="request-items">
        <li v-for="friendRequest in friendRequests" :key="friendRequest._id">
          {{ friendRequest.from }}
          <button class="message-button" @click="acceptRequest(friendRequest.from)">Accept</button>
          <button class="message-button" @click="rejectRequest(friendRequest.from)">Reject</button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: Arial, sans-serif;
}

.request-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.request-items li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #f9fdfb;
  border: 1px solid #d4e8dc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Button styles */
button {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(45deg, #6bbe92, #3aa76d, #1f7a4d);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: linear-gradient(45deg, #3aa76d, #1f7a4d, #6bbe92);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.no-requests,
.loading-text {
  color: #999;
  text-align: center;
  font-size: 14px;
}
</style>
