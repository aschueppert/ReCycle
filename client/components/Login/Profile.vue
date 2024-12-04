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

// Fetch the scores data
async function getSeeds() {
  try {
    const seedResults = await fetchy(`/api/seeds`, "GET", {});
    seeds.value = seedResults; // Assign the response to scores
  } catch (_) {
    seeds.value = 0; // Handle errors by resetting scores
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
  await getCosmetics();
  await getFriends();
  loaded.value = true;
});
</script>
<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <article v-if="loaded">
    <div class="seeds">
      <div class="icons">
        <img class="seed" :src="'client/components/Login/seed.png'" />
        <h1>{{ seeds.value }} Seeds</h1>
      </div>
      <div class="icons">
        <h1><i class="fas fa-users"></i> {{ friends.length }} Friends</h1>
      </div>
    </div>
    <h1>Garden</h1>
    <router-link :to="{ name: 'Garden' }" class="icons">
      <div v-for="item in cosmetics" :key="item">
        <img class="plants" v-if="item != null" :src="'client/components/Plants/' + item.description" />
      </div>
    </router-link>
    <h1>Friends</h1>
    <div v-for="friend in friends" :key="friend">
      {{ friend }}
    </div>
  </article>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.icons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  padding: 0.5em;
  background-color: lightgray;
  border: 2px solid lightgray; /* Adjust the border color as needed */
  border-radius: 15px; /* Adjust the radius for rounded corners */
  align-items: center;
  height: 5em;
}

.seeds {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

article {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
.seed {
  height: 2.7em;
}
.plants {
  height: 3em;
}
img {
  height: 60%;
}
</style>
