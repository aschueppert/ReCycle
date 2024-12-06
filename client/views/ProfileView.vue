<script setup lang="ts">
import Profile from "@/components/Login/Profile.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import SettingView from "./SettingView.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <Profile />
    <SettingView />
  </main>
</template>
