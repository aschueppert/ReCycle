<script setup lang="ts">
import CameraFeed from "@/components/Camera/CameraFeed.vue";
import LeaderboardComponent from "@/components/Leaderboard/LeaderboardComponent.vue";
</script>

<template>
  <main class="main-container">
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

.main-container {
  padding-bottom: 20px; /* Add breathing room at the bottom */
}
</style>
