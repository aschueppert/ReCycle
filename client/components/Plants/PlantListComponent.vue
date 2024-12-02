<script setup lang="ts">
import PlantComponent from "@/components/Plants/PlantComponent.vue";
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

async function getAllCosmetics() {
  try {
    const all_cosmeticsResults = await fetchy(`/api/allcosmetics`, "GET", {});
    all_cosmetics.value = all_cosmeticsResults; // Assign the response to scores
  } catch (e) {
    console.log(e);
  }
}
async function classify() {
  try {
    await fetchy(`/api/classify`, "POST", {});
    await getSeeds(); // Refresh the scores after classifying
    await getCosmetics();
  } catch (e) {
    console.log(e);
  }
}

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getCosmetics();
  await getAllCosmetics();
  loaded.value = true;
});
</script>

<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <section v-if="loaded">
    <p>{{ seeds.value }} Seeds</p>
    <div class="icons" v-for="item in cosmetics">
      <div v-if="item != null">
        <i :key="item" :class="item.description"></i>
      </div>
    </div>
    <h1>Buy Plants</h1>
    <div class="plants">
      <PlantComponent v-for="item in all_cosmetics" :key="item" :item="item" @refresh="getCosmetics" />
    </div>
    <button @click="classify">getSeeds</button>
  </section>
</template>

<style scoped>
.plants {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Ensures items can wrap to the next line if necessary */
  gap: 1em; /* Space between the plant items */
}

.icons i {
  font-size: 3em;
  color: green;
}

button {
  margin-top: 1em;
}
</style>
