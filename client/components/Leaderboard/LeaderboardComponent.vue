<script>
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const points = ref();

async function getPoints() {
  try {
    const pointsResults = await fetchy(`/api/points/all`, "GET", {});
    points.value = pointsResults;
  } catch (_) {
    points.value = [];
  }
}
</script>

<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    <ul>
      <li v-for="(user, index) in points" :key="user.item">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="username">{{ user.item }}</span>
        <span class="points">{{ user.value }} pts</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.leaderboard {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.leaderboard h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
}

li:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
}

.username {
  flex-grow: 1;
  margin-left: 10px;
}

.points {
  font-weight: bold;
  color: #333;
}
</style>
