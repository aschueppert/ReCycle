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

<style scoped>
/* Container styling */
div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2 {
  font-size: 20px;
  color: #3aa76d;
  text-align: center;
  margin-bottom: 10px;
}

/* Input styling */
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d4e8dc;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #3aa76d;
  box-shadow: 0 0 5px rgba(58, 167, 109, 0.5);
}

/* Search results */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #d4e8dc;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: #f9fdfb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Buttons */
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

p {
  color: #999;
  text-align: center;
}
</style>
