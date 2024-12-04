<script setup lang="ts">
import { useFriendsStore, useFriendRequestsStore } from "@/stores/friend";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const friendsStore = useFriendsStore();
const { friends } = storeToRefs(useFriendsStore());
const friendRequestsStore = useFriendRequestsStore();
const { friendRequests } = storeToRefs(useFriendRequestsStore());
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const loaded = ref(false);
// State for search bar
const searchQuery = ref("");
const searchResults = ref<string[]>([]); // Simulate a list of usernames to search

// Filtered list based on search query
const filterUsers = async () => {
  if (searchQuery.value.trim() === "") {
    searchResults.value = [];
    return;
  }
  let allUsers;
  try {
    allUsers = await fetchy(`/users`, "GET");
  } catch (_) {
    return;
  }
  searchResults.value = allUsers.value.filter((user: { username: string }) => user.username.toLowerCase().includes(searchQuery.value.toLowerCase()));
};

// Send friend request
const sendRequest = async (username: string) => {
  try {
    await fetchy(`/api/friend/requests/${username}`, "POST");
    alert(`Friend request sent to ${username}`);
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};
</script>

<template>
  <div>
    <h2>Search for Friends</h2>
    <input v-model="searchQuery" @input="filterUsers" type="text" placeholder="Search for a username" />
    <ul v-if="searchResults.length">
      <li v-for="user in searchResults" :key="user">
        <span>{{ user }}</span>
        <button @click="sendRequest(user)">Add Friend</button>
      </li>
    </ul>
    <p v-else-if="searchQuery.trim()">No results found</p>
  </div>
</template>
