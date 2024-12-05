<script setup lang="ts">
import Profile from "@/components/Login/Profile.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import SettingView from "./SettingView.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>{{ currentUsername }}'s Profile</h1>
    <Profile />
    <SettingView />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
