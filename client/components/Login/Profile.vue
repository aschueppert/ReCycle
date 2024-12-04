<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// Accessing the isLoggedIn state from the store
const { isLoggedIn } = storeToRefs(useUserStore());

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

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getPoints();
  await getCosmetics();
  await getFriends();
  await getStreak();
  loaded.value = true;
});
</script>
<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <article v-if="loaded">
    <div class="icons">
      <button>
        <p>{{ seeds.value }} Seeds</p>
      </button>
      <button>
        <p>{{ points.value }} Points</p>
      </button>
      <button>
        <p>{{ streak.value }} Day Streak</p>
      </button>

      <button>
        <p><i class="fas fa-users"></i> {{ friends.length }} Friends</p>
      </button>
    </div>
    <h1>Garden</h1>
    <button>
      <router-link :to="{ name: 'Garden' }" class="icons">
        <div v-for="item in cosmetics" :key="item">
          <img class="plants" v-if="item != null" :src="'client/assets/images/' + item.description" />
        </div>
        <router-link :to="{ name: 'Plants' }" class="plus">+</router-link>
      </router-link>
    </button>
    <h1>Friends</h1>
    <button class="icons">
      <div v-for="friend in friends" :key="friend" class="circle">{{ friend[0] }}</div>
      <router-link :to="{ name: 'AddFriend' }" class="plus">+</router-link>
    </button>
  </article>
</template>

<style scoped>
.icons {
  display: flex;
  gap: 0.5em;
  align-items: center;
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
  padding: 1em;
}
.plus {
  font-size: 3em;
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
}
img {
  height: 3em;
}
</style>
