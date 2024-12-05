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
          {{ friend }}
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
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.friend-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  border: 1px solid #d4e8dc;
  border-radius: 10px;
  overflow: hidden;
  background: #f9fdfb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.friend-items li {
  padding: 10px 20px;
  margin: 0;
  border-bottom: 1px solid #d4e8dc;
  background: #ffffff;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #3aa76d;
  font-weight: bold;
}

.friend-items li:last-child {
  border-bottom: none;
}

.friend-items li:hover {
  background: linear-gradient(45deg, #6bbe92, #3aa76d, #1f7a4d);
  color: white;
  cursor: pointer;
}

.no-friends,
.loading-text {
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}

.no-friends {
  color: #6bbe92;
}

.loading-text {
  color: #3aa76d;
}
</style>
