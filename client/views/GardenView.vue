<script setup lang="ts">
import Garden from "@/components/Plants/Garden.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>{{ currentUsername }}'s Garden</h1>
    <Garden />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
