<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
// create activity first
import MessageComponent from "../Messaging/MessageComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const friends = ref<Array<Record<string, string>>>([]);
const activeChat = ref<string | null>(null);

async function getFriends() {
  const query: Record<string, string> = { username: currentUsername.value };
  let friendResults;
  try {
    friendResults = await fetchy(`/api/follow/friends`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  friends.value = friendResults;
}

async function viewMessages(friend: string) {
  void router.push({ name: "Messages", params: { friend } });
}

function openChat(friend: string) {
  activeChat.value = friend;
}

onBeforeMount(async () => {
  await getFriends();
  loaded.value = true;
});
</script>
<template>
  <div class="container">
    <aside class="sidebar">
      <h2 v-if="isLoggedIn">Friends List</h2>
      <h2 v-else-if="!isLoggedIn" class="no-friends">Login First!</h2>
      <ul v-if="loaded && friends.length !== 0" class="friends-list">
        <li v-for="friend in friends" :key="friend._id" class="friend-item" @click="openChat(friend.followed === currentUsername ? friend.follower : friend.followed)">
          <span style="font-weight: bold">{{ friend.followed === currentUsername ? friend.follower : friend.followed }}</span>
          <button class="message-button" @click="openChat(friend.followed === currentUsername ? friend.follower : friend.followed)">Messages</button>
        </li>
      </ul>
      <p v-else-if="loaded && isLoggedIn" class="no-friends" style="padding-left: 1.5em">No Friends yet. Mutually follow each other to be friends.</p>
      <p v-else-if="!loaded" class="loading">Loading...</p>
    </aside>
    <main v-if="activeChat" class="message-content">
      <MessageComponent :friend="activeChat" />
    </main>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: Georgia, "Times New Roman", Times, serif;
}

.message-content {
  width: 90%;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar {
  width: 20%;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
}

.sidebar h2 {
  font-size: 21px;
  font-family: Calibri, sans-serif;
  color: #000000;
  margin-bottom: 16px;
  margin-left: 0.5em;
}

.friends-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: small;
}

.message-button {
  background-color: #171818;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.message-button:hover {
  background-color: #474849;
}

.no-friends,
.loading {
  color: #949494;
  font-size: 15px;
  font-weight: bold;
  padding: 10px;
}
</style>
