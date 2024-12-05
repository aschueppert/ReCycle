<script setup lang="ts">
import ActivityListComponent from "@/components/Activity/ActivityListComponent.vue";
import LeaderboardComponent from "@/components/Leaderboard/LeaderboardComponent.vue";
import { ref } from "vue";

// State to manage the selected view
const selectedView = ref<"leaderboard" | "activityList">("leaderboard");

// Function to switch views
const switchView = (view: "leaderboard" | "activityList") => {
  selectedView.value = view;
};
</script>

<template>
  <div class="toggle-view-container">
    <!-- Instagram-Style Toggle Buttons -->
    <div class="toggle-buttons">
      <button :class="{ active: selectedView === 'leaderboard' }" @click="switchView('leaderboard')">Leaderboard</button>
      <button :class="{ active: selectedView === 'activityList' }" @click="switchView('activityList')">Activity List</button>
    </div>

    <!-- Conditional Rendering of Components -->
    <div class="view-content">
      <LeaderboardComponent v-if="selectedView === 'leaderboard'" />
      <ActivityListComponent v-else-if="selectedView === 'activityList'" />
    </div>
  </div>
</template>

<style scoped>
.toggle-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.toggle-buttons {
  display: flex;
  background: #f0f0f0;
  border-radius: 30px;
  padding: 0.2rem;
  margin-bottom: 1rem;
  width: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toggle-buttons button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.toggle-buttons button.active {
  background: linear-gradient(45deg, #55c58a, #44b076, #3caf72);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.toggle-buttons button:not(.active):hover {
  color: #000;
}

.view-content {
  width: 100%;
  max-width: 800px;
  margin-top: 1rem;
}
</style>
