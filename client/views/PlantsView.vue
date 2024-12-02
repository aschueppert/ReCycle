<script setup lang="ts">
import PlantListComponent from "@/components/Plants/PlantListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Garden Store</h1>
    <PlantListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
