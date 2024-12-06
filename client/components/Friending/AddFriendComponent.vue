<script setup lang="ts">
import { useFriendRequestsStore, useFriendsStore } from "@/stores/friend";
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
    const response = await fetchy(`/api/users`, "GET", { alert: false });
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
    await fetchy(`/api/friend/requests/${username}`, "POST", { alert: false });
    alert(`Friend request sent to ${username}`);
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};
</script>

<template>
  <div>
    <input v-model="searchQuery" @input="filterUsers" type="text" placeholder="Search for a username" />
    <ul v-if="searchResults.length">
      <li v-for="user in searchResults" :key="user.username">
        <span>{{ user.username }}</span>
        <button class="button" @click="sendRequest(user.username)">Add Friend</button>
      </li>
    </ul>
    <p v-else-if="searchQuery.trim()">No results found</p>
  </div>
</template>

<style scoped>
/* Container styling */
div {
  font-family: var(--base-font);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2 {
  font-family: var(--base-font);
  font-size: 20px;
  color: #3aa76d;
  text-align: center;
  margin-bottom: 10px;
}

/* Style for the input */
input[type="text"],
input[type="password"] {
  font-family: var(--base-font);
  padding: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 15px; /* Rounded corners */
  border: 2px solid #000000; /* Black border */
  color: #044120;
  font-size: 1em;
  resize: none;
  outline: none;
  margin-right: 0.5em;
  border-color: #000000; /* Black border */
  transition:
    box-shadow 0.3s,
    border-color 0.3s; /* Smooth transition for border color */
}

/* Focus effect for input */
input[type="text"]:focus,
input[type="password"]:focus {
  font-family: var(--base-font);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5); /* Smooth outer glow effect */
  border-color: #044120; /* Change color on focus */
  transition:
    box-shadow 0.3s,
    border-color 0.3s; /* Smooth transition for the shadow effect */
}

input:required:invalid {
  font-family: var(--base-font);
  color: black;
}

/* Search results */
ul {
  font-family: var(--base-font);
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  font-family: var(--base-font);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1em;
  padding-right: 1em;
  border-bottom: 1px solid #044120;
  margin-bottom: 10px;
}

/* Buttons */

p {
  font-family: var(--base-font);
  color: #044120;
  text-align: center;
}
</style>
