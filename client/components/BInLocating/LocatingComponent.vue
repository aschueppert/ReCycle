<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MapComponent from "./MapComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const locating = ref(false);

onBeforeMount(async () => {
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <button @click="locating = !locating">Locate Bins</button>
    <MapComponent v-if="locating" />
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
