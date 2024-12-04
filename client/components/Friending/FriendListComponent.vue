<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const friends = ref<Array<Record<string, string>>>([]);

async function getFriends() {
  let friendResults;
  try {
    friendResults = await fetchy(`/api/friends`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  friends.value = friendResults;
}

onBeforeMount(async () => {
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <div class="friends-list">
    <div v-if="loaded && friends.length !== 0">
      <ul class="friend-items">
        <li v-for="friend in friends" :key="friend._id">
          {{ currentUsername === friend.user1 ? friend.user2 : friend.user1 }}
        </li>
      </ul>
    </div>
    <div v-else-if="loaded" class="no-friends">
      <p>No friends yet!</p>
    </div>
    <div v-else class="loading-text">Loading...</div>
  </div>
</template>

<style scoped>
.friends-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
}

.friend-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.friend-items li {
  padding: 10px;
  margin: 5px 0;
  text-align: center;
}

.no-friends,
.loading-text {
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}
</style>
