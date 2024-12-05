<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const activity = ref<Array<Record<string, string>>>([]);
const friends = ref<Array<Record<string, string>>>([]);
const selectedType = ref<"personal" | "friends">("personal");

// Fetch activity data
async function getActivity() {
  try {
    const activityResults = await fetchy(`/api/classify`, "GET");
    activity.value = activityResults;
  } catch (error) {
    console.error("Error fetching activity:", error);
    activity.value = [];
  }
}

// Fetch friends data
async function getFriends() {
  try {
    const friendResults = await fetchy(`/api/friends`, "GET", { alert: false });
    friends.value = friendResults;
  } catch (error) {
    console.error("Error fetching friends:", error);
    friends.value = [];
  }
}

// Filter activity based on selected type
const filteredActivity = computed(() => {
  if (selectedType.value === "personal") {
    return activity.value.filter((act) => act.user === currentUsername.value);
  } else if (selectedType.value === "friends") {
    const friendIds = friends.value.map((friend) => friend._id);
    return activity.value.filter((act) => friendIds.includes(act.user));
  }
  return [];
});

onBeforeMount(async () => {
  loaded.value = false;
  await Promise.all([getActivity(), getFriends()]);
  loaded.value = true;
});

// Switch between personal and friend activity
const switchActivityType = (type: "personal" | "friends") => {
  selectedType.value = type;
};
</script>

<template>
  <div class="activity-container">
    <!-- Activity Type Toggle -->
    <div class="activity-toggle">
      <button :class="{ active: selectedType === 'personal' }" @click="switchActivityType('personal')">Personal Activity</button>
      <button :class="{ active: selectedType === 'friends' }" @click="switchActivityType('friends')">Friend Activity</button>
    </div>

    <!-- Activity List -->
    <div class="activity-list">
      <div v-if="loaded && filteredActivity.length !== 0">
        <ul class="activity-items">
          <li v-for="act in filteredActivity" :key="act._id">
            <strong>{{ act.type }}:</strong> {{ act.item }}
          </li>
        </ul>
      </div>
      <div v-else-if="loaded" class="no-activity">
        <p>No activity yet!</p>
      </div>
      <div v-else class="loading-text">Loading...</div>
    </div>
  </div>
</template>

<style>
.activity-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.activity-toggle button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.activity-toggle button.active {
  background-color: #007bff;
  color: white;
}

.activity-list {
  text-align: center;
}
</style>
