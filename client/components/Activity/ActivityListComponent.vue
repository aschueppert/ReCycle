<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const activity = ref<Array<Record<string, string>>>([]);
const friendsActivity = ref<Array<Record<string, string>>>([]);
const selectedType = ref<"personal" | "friends">("personal");

// Fetch activity data
async function getActivity() {
  try {
    const activityResults = await fetchy(`/api/classify`, "GET", { alert: false });
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
    const friends = await fetchy("/api/friends", "GET", { alert: false });
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

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const date = new Date(dateString);
  return date.toLocaleString("en-US", options);
}

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
      <button :class="{ active: selectedType === 'personal' }" @click="switchActivityType('personal')">Personal</button>
      <button :class="{ active: selectedType === 'friends' }" @click="switchActivityType('friends')">Friends</button>
    </div>

    <!-- Activity List -->
    <div class="activity-list">
      <div v-if="loaded && filteredActivity.length !== 0">
        <ul class="activity-items">
          <li v-for="act in filteredActivity" :key="act._id">
            <span class="avatar">{{ act.user[0] }}</span>
            <div class="activity-details">
              <p>
                <strong>{{ act.user }}</strong> disposed of <strong>{{ act.type }}</strong>
              </p>
              <p class="timestamp">{{ formatDate(act.dateCreated) }}</p>
            </div>
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

<style scoped>
.activity-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.activity-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.activity-toggle button {
  padding: 0.7rem 1.5rem;
  border: 1px solid #ddd;
  background: #f8f8f8;
  border-radius: 25px;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.activity-toggle button.active {
  background-color: #17a217;
  color: white;
  border: none;
}

.activity-toggle button:hover {
  background: #90f4a9;
}

.activity-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.activity-items li {
  display: flex;
  align-items: center;
  background: #fafafa;
  margin: 0.5rem 0;
  padding: 0.8rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.activity-items li:hover {
  transform: scale(1.02);
}

.avatar {
  width: 40px;
  height: 40px;
  background: #41c51c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.activity-details {
  text-align: left;
}

.timestamp {
  font-size: 0.9rem;
  color: #999;
}

.no-activity,
.loading-text {
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
}
</style>
