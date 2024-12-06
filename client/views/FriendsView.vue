<script setup lang="ts">
import AddFriendComponent from "@/components/Friending/AddFriendComponent.vue";
import FriendListComponent from "@/components/Friending/FriendListComponent.vue";
import FriendRequestListComponent from "@/components/Friending/FriendRequestListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <div class="friends-view">
    <h1>Friends List</h1>
    <div class="friend-list-container">
      <FriendListComponent />
    </div>
  </div>
  <div class="friends-view">
    <h1>Incoming Friend Requests</h1>
    <div class="friend-list-container">
      <FriendRequestListComponent />
    </div>
  </div>
  <div class="friends-view last-view">
    <h1>Add Friends</h1>
    <AddFriendComponent />
  </div>
</template>

<style scoped>
.last-view {
  padding-bottom: 2em;
}

/* Container styling */
.friends-view {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: #044120;
}

/* Heading styling */
.friends-view h1 {
  font-size: 24px;
  margin-top: 1em;
  margin-bottom: 1em;
}

/* Friend list container */
.friend-list-container {
  padding: 20px;
  border: 4px solid #044120;
  border-radius: 20px;
  margin: 1em;
  margin-bottom: 3em;
}
</style>
