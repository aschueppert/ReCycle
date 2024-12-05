<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FriendListComponent from "@/components/Friending/FriendListComponent.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>
<template>
  <h1>Friends List</h1>
  <div>
    <FriendListComponent />
  </div>
</template>
<style scoped></style>
