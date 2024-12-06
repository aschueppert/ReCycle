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
    const seedResults = await fetchy(`/api/seeds`, "GET", { alert: false });
    seeds.value = seedResults; // Assign the response to scores
  } catch (_) {
    seeds.value = 0; // Handle errors by resetting scores
  }
}

async function getCosmetics() {
  try {
    const cosmeticsResults = await fetchy(`/api/cosmetics`, "GET", { alert: false });
    console.log(cosmeticsResults);
    cosmetics.value = cosmeticsResults;
  } catch (e) {
    console.log(e);
  }
}

async function getAllCosmetics() {
  try {
    const all_cosmeticsResults = await fetchy(`/api/allcosmetics`, "GET", { alert: false });
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
  <article v-if="loaded">
    <h2>Buy Plants to Add to your Garden!</h2>
    <div class="seeds">
      <img class="seed" src="@/components/Login/seed.png" />
      <p>{{ seeds.value }} Seeds</p>
    </div>
    <div class="plants">
      <PlantComponent v-for="item in all_cosmetics" :key="item" :item="item" @refresh="getCosmetics" />
    </div>
    <!-- <button @click="classify">get seeds</button>
    <CreatePlantForm @refresh="getAllCosmetics" /> -->
  </article>
  <article v-else>
    <p>Loading...</p>
  </article>
</template>

<style scoped>
/* General styling */
article {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em; /* Reduced gap between elements */
  padding: 1em 2em; /* Reduced top padding */
  margin-top: 0; /* Ensure no extra margin from parent containers */
}

/* Text styling */
h2 {
  color: #044120;
  font-weight: bold;
  margin-bottom: 0.2em; /* Reduce space below the heading */
}

p {
  color: #044120;
  margin: 0;
}

/* Plants container */
.plants {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  margin-top: 1em;
}

/* Seeds button */
.seeds {
  display: flex;
  align-items: center;
  color: #044120;
  font-size: 1rem;
}

.seed {
  height: 40px;
  width: 40px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .plants {
    flex-direction: column;
    gap: 0.5em;
  }

  .seeds {
    flex-direction: column;
    text-align: center;
  }
}
</style>
