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
const all_cosmetics = ref();
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

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getCosmetics();
  loaded.value = true;
});
</script>
<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <article v-if="loaded">
    <h1>{{ seeds.value }} Seeds</h1>
    <h1>Garden</h1>
    <router-link :to="{ name: 'Garden' }" class="icons">
      <div v-for="item in cosmetics" :key="item">
        <img v-if="item != null" :src="'client/components/Plants/' + item.description" />
      </div>
    </router-link>
  </article>
</template>

<style scoped>
.plants {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5em;
}

.icons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  padding: 1em;
  background-color: lightgray;
  border: 2px solid lightgray; /* Adjust the border color as needed */
  border-radius: 15px; /* Adjust the radius for rounded corners */
}

article {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
img {
  width: 40px;
  height: 60px;
}
</style>
