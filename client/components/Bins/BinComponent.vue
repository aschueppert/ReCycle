<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const GOOGLE_MAP_API_KEY = "AIzaSyDqYZHShrNYA5aDPkiOfq2I5iEOcUBUKnw";

const loaded = ref(false);

const mapMode = ref<"view" | "directions">("view");
const latitude = ref(0); // Default latitude
const longitude = ref(0); // Default longitude

const mapUrl = ref("");

function updateMapUrl() {
  mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&center=${latitude.value},${longitude.value}`;
}

async function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      },
    );
  } else {
    console.log("Geolocation not supported");
  }
}

onBeforeMount(async () => {
  await getUserLocation();
  updateMapUrl();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded">
    <h2>User Coordinates:</h2>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <iframe :src="mapUrl" width="600" height="450" style="border: 0" loading="lazy"></iframe>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 10px;
}
iframe {
  margin-top: 20px;
}
</style>
