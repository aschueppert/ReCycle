<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const func = ref<"add" | "nearest">("nearest");
const coords = ref<{ lat: number; lng: number } | null>(null);
const lat = ref(0);
const lng = ref(0);
const type = ref("");

// get nearest
async function getNearestBins(lat: number, lng: number, type: string) {
  try {
    const binResults = await fetchy(`/api/bin/${lat}/${lng}/${type}`, "GET", {});
    console.log(binResults);
    coords.value = binResults; // Assign the response to scores
  } catch (_) {
    coords.value = null;
  }
}

// add bin
async function addBin(lat: number, lng: number, type: string) {
  try {
    await fetchy(`/api/bin`, "POST", {
      body: {
        lat: lat,
        lng: lng,
        type: [type],
      },
    });
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <section v-if="func == 'nearest'">
      <h1>Get nearest bin:</h1>
      <form class="pure-form">
        <fieldset>
          <legend>current location:</legend>
          <input id="lat" type="number" v-model="lat" placeholder="latitude" />
          <input id="lon" type="number" v-model="lng" placeholder="longitude" />
          <input id="type" type="string" v-model="type" placeholder="type" />
          <button type="button" @click="getNearestBins(lat, lng, type)" class="pure-button pure-button-primary">Search</button>
        </fieldset>
      </form>
      <p v-if="coords">Nearest location: {{ coords.lat }}, {{ coords.lng }}</p>
      <button @click="func = 'add'">Add Bin</button>
    </section>
    <section v-if="func == 'add'">
      <h1>Add bin:</h1>
      <form @submit.prevent="addBin(lat, lng, type)" class="pure-form">
        <fieldset>
          <legend>bin location:</legend>
          <input id="lat" type="number" v-model="lat" placeholder="latitude" />
          <input id="lon" type="number" v-model="lng" placeholder="latitude" />
          <input id="type" type="string" v-model="type" placeholder="type" />
          <button type="submit" class="pure-button pure-button-primary">Add</button>
        </fieldset>
      </form>
      <button @click="func = 'nearest'">Get Nearest Bin</button>
    </section>
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
