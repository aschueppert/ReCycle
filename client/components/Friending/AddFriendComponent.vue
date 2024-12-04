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
const searchResults = ref<{ username: string }[]>([]);

// Filtered list based on search query
const filterUsers = async () => {
  if (searchQuery.value.trim() === "") {
    searchResults.value = [];
    return;
  }

  try {
    // Fetch users from the API
    const response = await fetchy(`/api/users`, "GET");
    // Assuming `response` is an array of UserDoc
    const allUsers: { username: string; password: string; lastOnline: number }[] = response;

    // Filter users based on the search query
    searchResults.value = allUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.value.toLowerCase())).map((user) => ({ username: user.username })); // Redact sensitive data
  } catch (error) {
    console.error("Error fetching users:", error);
    searchResults.value = [];
  }
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
      <li v-for="user in searchResults" :key="user.username">
        <span>{{ user.username }}</span>
        <button @click="sendRequest(user.username)">Add Friend</button>
      </li>
    </ul>
    <p v-else-if="searchQuery.trim()">No results found</p>
  </div>
</template>
