<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

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
  text-align: center;
  font-size: 16px;
  font-family: var(--base-font);
  color: #044120;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.friend-items {
  font-family: var(--base-font);
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.no-friends {
  font-family: var(--base-font);
  color: #044120;
}

.loading-text {
  font-family: var(--base-font);
  color: #044120;
}
</style>
