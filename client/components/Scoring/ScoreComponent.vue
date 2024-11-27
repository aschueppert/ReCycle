<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let scores = ref<Array<Record<string, string>>>([]);

async function getScores() {
  let scoreResults;
  try {
    scoreResults = await fetchy(`/api/scores`, "GET", {});
  } catch (_) {
    return;
  }
  scores.value = scoreResults;
}

async function buyPlant() {
  try {
    await fetchy(`/api/purchase`, "POST", {});
  } catch (_) {
    return;
  }
  getScores();
}

async function classify() {
  try {
    await fetchy(`/api/classify`, "POST", {});
  } catch (_) {
    return;
  }
  getScores();
}

onBeforeMount(async () => {
  await getScores();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <article v-for="score in scores" :key="score._id">
      <p>{{ score.value }}</p>
    </article>
    <button @click="buyPlant">Buy Plant</button>
    <button @click="classify">Classify</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  gap: 1em;
}
</style>
