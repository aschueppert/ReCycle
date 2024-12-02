<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import PlantComponent from "./PlantComponent.vue";
// Accessing the isLoggedIn state from the store
const { isLoggedIn } = storeToRefs(useUserStore());

const cosmetics_ids: Record<string, string> = { "507f191e810c19729de860ea": "fas fa-seedling" };
// Reactive states
const loaded = ref(false);
const seeds = ref();
const cosmetics = ref();
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
    cosmetics.value = cosmeticsResults; // Assign the response to scores
  } catch (_) {
    cosmetics.value = 0; // Handle errors by resetting scores
  }
}
async function classify() {
  try {
    await fetchy(`/api/classify`, "POST", {});
    await getSeeds(); // Refresh the scores after classifying
    await getCosmetics();
  } catch (_) {
    // Error handling
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
  <section v-if="loaded">
    <p>{{ seeds.value }} Seeds</p>
    <div class="plants">
      <i v-for="item in cosmetics.items" :key="item" :class="cosmetics_ids[item]"></i>
    </div>
    <PlantComponent @refresh="getCosmetics" />
    <button @click="classify">getSeeds</button>
  </section>
</template>

<style scoped>
.plants {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Ensures items can wrap to the next line if necessary */
  gap: 1em; /* Space between the plant items */
  justify-content: center; /* Centers the items horizontally */
}

i {
  font-size: 3em;
  color: green;
}

button {
  margin-top: 1em;
}
</style>
