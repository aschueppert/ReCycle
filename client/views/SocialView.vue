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
      <button :class="['button', { active: selectedView === 'leaderboard' }]" @click="switchView('leaderboard')">Leaderboard</button>
      <button :class="['button', { active: selectedView === 'activityList' }]" @click="switchView('activityList')">Activity List</button>
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
  width: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  gap: 0.5em;
}

.button {
  margin-bottom: 0;
}

.toggle-buttons button {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.toggle-buttons button.hover {
  background-color: #056635;
}

.toggle-buttons button.active {
  background-color: #044120;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.toggle-buttons button:not(.active):hover {
  transform: scale(1.1);
  color: #044120;
}

.view-content {
  width: 100%;
  max-width: 800px;
  margin-top: 1rem;
}
</style>
