<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FriendListComponent from "@/components/Friending/FriendListComponent.vue";
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>
<template>
  <h1>Friends List</h1>
  <RouterLink :to="{ name: 'AddFriend' }" :class="{ underline: currentRouteName == 'AddFriend' }">Add</RouterLink>
  <div>
    <FriendListComponent />
  </div>
</template>
<style scoped></style>
