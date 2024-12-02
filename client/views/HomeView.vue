<script setup lang="ts">
import CameraFeed from "@/components/Camera/CameraFeed.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <div class="min-h-screen flex items-center justify-center">
        <CameraFeed />
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
