<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LocatingFormComponent from "./LocatingFormComponent.vue";
import MapComponent from "./MapComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const func = ref<"locating" | "adding" | "">("");
const coords = ref<{ lat: number | undefined; lng: number | undefined }>({ lat: undefined, lng: undefined });

function setCoords(lat: number, lng: number) {
  coords.value = { lat, lng };
}

onBeforeMount(async () => {
  loaded.value = true;
});
</script>

<template>
  <menu class="buttons">
    <li><button @click="func = 'locating'">Locate Nearest Bin</button></li>
    <li><button @click="func = 'adding'" v-if="isLoggedIn">Add Bin</button></li>
  </menu>

  <section class="input-form" v-if="func !== ''">
    <LocatingFormComponent :type="func" @setCoords="setCoords" @cancel="func = ''" />
  </section>

  <section class="map-frame">
    <MapComponent :coords="coords" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 5em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

button {
  margin-top: 1em;
}

.buttons {
  justify-content: center;
}

.input-form {
  margin-top: 1em;
  margin-bottom: 1.5em;
}

.map-frame {
  margin: auto;
  margin-top: 1.5em;
  width: fit-content;
  height: fit-content;
  border: 1px solid black;
}
</style>
