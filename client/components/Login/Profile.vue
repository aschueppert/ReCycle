<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// Accessing the isLoggedIn state from the store
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const seeds = ref();
const cosmetics = ref();
const friends = ref();
const points = ref();
const streak = ref();

// Fetch the scores data
async function getSeeds() {
  try {
    const seedResults = await fetchy(`/api/seeds`, "GET", {});
    seeds.value = seedResults; // Assign the response to scores
  } catch (_) {
    seeds.value = 0; // Handle errors by resetting scores
  }
}

async function getPoints() {
  try {
    const pointsResults = await fetchy(`/api/points`, "GET", {});
    points.value = pointsResults; // Assign the response to scores
  } catch (_) {
    points.value = 0; // Handle errors by resetting scores
  }
}

async function getStreak() {
  try {
    const streakResults = await fetchy(`/api/streak`, "GET", {});
    streak.value = streakResults; // Assign the response to scores
  } catch (_) {
    streak.value = 0; // Handle errors by resetting scores
  }
}

async function getCosmetics() {
  try {
    const cosmeticsResults = await fetchy(`/api/cosmetics`, "GET", {});
    console.log(cosmeticsResults);
    cosmetics.value = cosmeticsResults;
  } catch (e) {
    console.log(e);
  }
}
async function getFriends() {
  try {
    const friendsResults = await fetchy(`/api/friends`, "GET", {});
    friends.value = friendsResults; // Assign the response to scores
  } catch (e) {
    console.log(e);
  }
}

async function viewLeaderboard() {
  void router.push({ name: "Social" });
}

async function viewPlants() {
  void router.push({ name: "Plants" });
}

async function viewFriends() {
  void router.push({ name: "Friends" });
}

async function viewGarden() {
  void router.push({ name: "Garden" });
}

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getPoints();
  await getCosmetics();
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <h1>{{ currentUsername }}'s Profile</h1>
  <article v-if="loaded">
    <div class="icons">
      <div class="menu-option" @click="viewLeaderboard">{{ points.value }} Experience</div>
      <div class="menu-option" @click="viewPlants">{{ seeds.value }} Seeds</div>
      <div class="menu-option" @click="viewFriends">{{ friends.length }} Friends</div>
    </div>
    <div>
      <h2 class="menu-option" @click="viewGarden">{{ currentUsername }}'s Garden</h2>
      <router-link :to="{ name: 'Garden' }" class="garden-container menu-option">
        <div v-for="item in cosmetics" :key="item">
          <img class="transparent-image" v-if="item != null" :src="item.description" />
        </div>
      </router-link>
    </div>
  </article>
  <article v-else>
    <p>Loading...</p>
  </article>
</template>

<style scoped>
.garden-container {
  background-color: #d5f7d5;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: clip;
  gap: 1em;
  justify-content: center;
  align-items: center; /* Center-align items vertically */
  text-align: center; /* Ensure proper centering for text content, if any */
  padding: 1em;
  margin-left: 2em;
  margin-right: 2em;
  border-radius: 20px;
  border: 4px solid #044120;
}

h1 {
  text-align: center;
  color: #044120;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}
h2 {
  text-align: center;
  color: #044120;
  margin-bottom: 0.25em;
  margin-top: 0.25em;
}
p {
  text-align: center;
  color: #044120;
  margin-bottom: 0;
  margin-top: 0.5em;
}
.circle {
  width: 3em;
  height: 3em;
  border-radius: 50%;
  background-color: darkgray;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
article {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
}
.plus {
  font-size: 3em;
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
}
img {
  width: 50px;
  height: 70px;
}
.transparent-image {
  mix-blend-mode: multiply; /* Makes white areas transparent */
  background-color: transparent;

  filter: brightness(1.2) saturate(1.8);
}

.icons {
  display: flex;
  justify-content: center;
  gap: 1.5em;
}

.menu-option {
  cursor: pointer;
  color: #044120;
  transition:
    transform 0.3s,
    filter 0.3s;
}
.menu-option:hover {
  text-decoration: underline;
  transform: scale(1.05); /* Slight scaling on hover */
  filter: drop-shadow(0px 0px 5px #cccccc); /* Add a shadow on hover */
  transition:
    filter 0.3s,
    transform 0.3s;
}
.menu-option:active {
  transform: scale(0.95); /* Slight scaling on click */
}
</style>
