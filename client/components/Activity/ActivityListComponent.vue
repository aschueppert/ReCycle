<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const activity = ref<Array<Record<string, string>>>([]);
const friendsActivity = ref<Array<Record<string, string>>>([]);
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

async function getFriendActivity() {
  if (!isLoggedIn.value) {
    return;
  }
  try {
    const friends = await fetchy("/api/friends", "GET", {});
    let friendsActivityResults: Array<Record<string, string>> = [];
    for (const act of activity.value) {
      if (friends.includes(act.user)) {
        friendsActivityResults.push(act);
      }
    }
    friendsActivity.value = friendsActivityResults;
  } catch (_) {
    return;
  }
}

// Filter activity based on selected type
const filteredActivity = computed(() => {
  if (selectedType.value === "personal") {
    return activity.value.filter((act) => act.user === currentUsername.value);
  } else if (selectedType.value === "friends") {
    return friendsActivity.value;
  }
  return [];
});

onBeforeMount(async () => {
  loaded.value = false;
  await getActivity();
  await getFriendActivity();
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
            {{ act.user }} classified <strong>{{ act.type }}</strong> at {{ act.dateCreated }}
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
