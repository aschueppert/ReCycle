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
// Fetch the scores data
async function getSeeds() {
  try {
    const seedResults = await fetchy(`/api/seeds`, "GET", {});
    seeds.value = seedResults; // Assign the response to scores
  } catch (_) {
    seeds.value = 0; // Handle errors by resetting scores
  }
}

async function getPlantLocations() {
  try {
    const cosmeticsResults = await fetchy(`/api/plantlocations`, "GET", {});
    console.log(cosmeticsResults);
    cosmetics.value = cosmeticsResults;
  } catch (e) {
    console.log(e);
  }
}

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getPlantLocations();
  loaded.value = true;
});
</script>
<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <article v-if="loaded">
    <p>{{ seeds.value }} Seeds</p>

    <div class="icons">
      <div v-for="item in cosmetics" :key="item">
        <i v-if="item != null" :class="item.description"></i>
      </div>
    </div>
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
  font-size: 3em;
  color: green;
}

button {
  margin-top: 1em;
}

article {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
</style>
