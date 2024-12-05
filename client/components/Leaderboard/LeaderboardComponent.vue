<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const points = ref<Array<Record<string, string>>>([]);

async function getPoints() {
  try {
    const pointsResults = await fetchy("/api/points/all", "GET", {});
    points.value = pointsResults;
  } catch (_) {
    return;
  }
}

function getRowClass(index: number) {
  if (index === 0) {
    return "gold medal";
  } else if (index === 1) {
    return "silver medal";
  } else if (index === 2) {
    return "bronze medal";
  }
  return "";
}

function getMedalEmoji(index: number) {
  if (index === 0) {
    return "🥇";
  } else if (index === 1) {
    return "🥈";
  } else if (index === 2) {
    return "🥉";
  }
  return "";
}

onBeforeMount(async () => {
  await getPoints();
  loaded.value = true;
});
</script>

<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    <div class="points-container">
      <ul v-if="loaded && points.length !== 0">
        <li v-for="(user, index) in points" :key="user.item" :class="getRowClass(index)">
          <span class="rank medal-emoji" v-if="index < 3">{{ getMedalEmoji(index) }}</span>
          <span class="rank" v-else>#{{ index + 1 }}</span>
          <span class="username">{{ user.item }}</span>
          <span class="points">{{ user.value }} pts</span>
        </li>
      </ul>
      <p v-else-if="loaded">No data found</p>
      <p v-else>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.leaderboard {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.leaderboard h2 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.points-container {
  max-height: 400px; /* adjustable height of leadeboard container */
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

li:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  color: #333;
}

.medal {
  font-size: 1.2rem;
}

.medal-emoji {
  text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.75);
}

.username {
  flex-grow: 1;
  margin-left: 10px;
}

.points {
  font-weight: bold;
  color: #333;
}

p {
  text-align: center;
  font-size: 1rem;
  color: #888;
}

.gold {
  background-color: #ffdc1f;
  font-weight: 550;
  border-radius: 4px;
}

.silver {
  background-color: #c3c3c3;
  font-weight: 550;
  border-radius: 4px;
}

.bronze {
  background-color: #d38f4c;
  font-weight: 550;
  border-radius: 4px;
}
</style>
