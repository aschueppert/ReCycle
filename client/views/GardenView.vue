<script setup lang="ts">
import Garden from "@/components/Plants/Garden.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <Garden />
  </main>
</template>
