<script setup lang="ts">
import Profile from "@/components/Login/Profile.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>{{ currentUsername }}'s Profile</h1>
    <Profile />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
