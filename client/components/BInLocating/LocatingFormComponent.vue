<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const emit = defineEmits(["setCoords", "cancel"]);
const props = defineProps(["type"]);

// Reactive states
const loaded = ref(false);
const coords = ref<{ lat: number | undefined; lng: number | undefined }>({ lat: undefined, lng: undefined });
const binType = ref("");
const errorMsg = ref("");

async function getCurrentLocation() {
  if (!navigator.geolocation) {
    errorMsg.value = "Sorry, geolocation is not supported by your browser";
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => (coords.value = { lat: position.coords.latitude, lng: position.coords.longitude }),
      () => (errorMsg.value = "Unable to retrieve location"),
    );
  }
}

async function getNearestBins(lat: number, lng: number, binType: string) {
  try {
    const results = await fetchy(`/api/bin/${lat}/${lng}/${binType}`, "GET", {});
    console.log(results);
    return results;
  } catch (_) {
    return undefined;
  }
}

// add bin
async function addBin(lat: number, lng: number, binType: string) {
  try {
    await fetchy(`/api/bin`, "POST", {
      body: {
        lat: lat,
        lng: lng,
        type: binType,
      },
    });
  } catch (_) {
    return;
  }
}

async function submitForm(coords: { lat: number | undefined; lng: number | undefined }, binType: string) {
  errorMsg.value = "";

  if (coords.lat !== undefined && coords.lng !== undefined && binType !== "") {
    if (props.type == "locating") {
      const results = await getNearestBins(coords.lat, coords.lng, binType);
      emit("setCoords", results.lat, results.lng);
    }
    if (props.type == "adding" && isLoggedIn) {
      await addBin(coords.lat, coords.lng, binType);
      emit("setCoords", coords.lat, coords.lng);
    }
  } else {
    errorMsg.value = "all values are mandatory";
  }

  emit("cancel");
}

onBeforeMount(async () => {
  loaded.value = true;
  errorMsg.value = "";
});
</script>

<template>
  <div class="coords">
    <p>{{ props.type == "locating" ? "Current" : "New" }} location:</p>
    <input id="lat" type="number" v-model="coords.lat" placeholder="latitude" />
    <input id="lon" type="number" v-model="coords.lng" placeholder="longitude" />
    <button type="button" class="pure-button" @click="getCurrentLocation">Use current location</button>
    <p v-if="errorMsg !== ''">
      <i>{{ errorMsg }}</i>
    </p>
  </div>

  <div class="bins">
    <p>Bin type:</p>
    <menu>
      <label><input type="radio" v-model="binType" value="trash" /> Trash</label>
      <label><input type="radio" v-model="binType" value="recycling" /> Recycling</label>
    </menu>
  </div>

  <menu class="buttons">
    <button type="button" @click="submitForm(coords, binType)" class="pure-button pure-button-primary">{{ props.type == "locating" ? "Search" : "Add" }}</button>
    <button type="button" @click="emit('cancel')" class="pure-button">Cancel</button>
  </menu>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.coords {
  display: flex;
  gap: 1em;
  align-items: center;
}

.coords input {
  height: 1.5em;
}

.bin p {
  margin: 0px;
}

menu {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
</style>
