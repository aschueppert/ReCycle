<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FriendListComponent from "@/components/Friending/FriendListComponent.vue";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>
<template>
  <div class="friends-view">
    <h1>Friends List</h1>
    <RouterLink :to="{ name: 'AddFriend' }" :class="{ active: currentRouteName === 'AddFriend' }" class="add-friend-link">Add Friend</RouterLink>
    <div class="friend-list-container">
      <FriendListComponent />
    </div>
  </div>
</template>

<style scoped>
/* Container styling */
.friends-view {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-family: Arial, sans-serif;
  color: #333;
}

/* Heading styling */
.friends-view h1 {
  font-size: 24px;
  color: #3aa76d;
  margin-bottom: 20px;
}

/* RouterLink styling */
.add-friend-link {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(45deg, #6bbe92, #3aa76d, #1f7a4d);
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-friend-link:hover {
  background: linear-gradient(45deg, #3aa76d, #1f7a4d, #6bbe92);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.add-friend-link.active {
  background: #3aa76d;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Friend list container */
.friend-list-container {
  padding: 20px;
  border: 1px solid #d4e8dc;
  border-radius: 10px;
  background: #f9fdfb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
