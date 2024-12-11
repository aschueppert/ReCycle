<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

// Accessing the isLoggedIn state from the store
const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const scores = ref<{ points: { value: number }; seeds: { value: number }; streaks: { value: number } } | null>(null);

// Fetch the scores data
async function getScores() {
  try {
    const scoreResults = await fetchy(`/api/scores`, "GET", {});
    scores.value = scoreResults; // Assign the response to scores
  } catch (_) {
    scores.value = null; // Handle errors by resetting scores
  }
}

// Trigger an action to buy a plant
async function buyPlant() {
  try {
    await fetchy(`/api/purchase`, "POST", { alert: true });
    await getScores(); // Refresh the scores after buying a plant
  } catch (_) {
    // Error handling
  }
}

// Trigger an action to classify
async function classify() {
  try {
    await fetchy(`/api/classify`, "POST", { alert: true });
    await getScores(); // Refresh the scores after classifying
  } catch (_) {
    // Error handling
  }
}

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getScores();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <article v-if="scores">
      <p>Points: {{ scores.points.value }}</p>
      <p>Seeds: {{ scores.seeds.value }}</p>
      <p>Streaks: {{ scores.streaks.value }}</p>
    </article>
    <button @click="buyPlant">Buy Plant</button>
    <button @click="classify">Classify</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 5em;
}

button {
  margin-top: 1em;
}
</style>
