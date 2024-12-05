<script setup lang="ts">
import CameraFeed from "@/components/Camera/CameraFeed.vue";
import LeaderboardComponent from "@/components/Leaderboard/LeaderboardComponent.vue";
</script>

<template>
  <main>
    <section>
      <div class="min-h-screen flex items-center justify-center">
        <CameraFeed />
      </div>
    </section>
  </main>
  <LeaderboardComponent />
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
