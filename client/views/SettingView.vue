<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h2>Settings</h2>
    <button class="button" @click="logout">Logout</button>
    <button class="button delete-user" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #044120;
  margin-bottom: 0;
  margin-top: 0;
}

.delete-user {
  background-color: #841a17; /* Red */
  color: white; /* White text */
  border-radius: 40px; /* Rounded corners */
  padding: 10px 20px; /* Comfortable padding */
}

.delete-user:hover {
  background-color: #a5211d; /* lighter red */
}
</style>
