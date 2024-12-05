<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const GOOGLE_MAP_API_KEY = "AIzaSyDqYZHShrNYA5aDPkiOfq2I5iEOcUBUKnw";

const loaded = ref(false);

const userLatitude = ref(0); // Default latitude
const userLongitude = ref(0); // Default longitude
const destinationLatitude = ref(0); // Default latitude
const destinationLongitude = ref(0); // Default longitude

const binType = ref<"trash" | "recycle">("trash");
const mapMode = ref<"view" | "directions">("view");
const mapUrl = ref("");

async function updateMapUrl() {
  mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&center=${userLatitude.value},${userLongitude.value}`;
}

async function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLatitude.value = position.coords.latitude;
        userLongitude.value = position.coords.longitude;
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      },
    );
  } else {
    console.log("Geolocation not supported");
  }
}

async function getNearestBin() {
  try {
    const result = await fetchy(`/api/bin/${userLatitude.value}/${userLongitude.value}/${binType.value}`, "GET", {});
    destinationLatitude.value = result.lat;
    destinationLongitude.value = result.lng;
  } catch (_) {
    return;
  }
}

async function locateBin() {
  await getNearestBin();
  mapMode.value = "directions";
  await updateMapUrl();
}

onBeforeMount(async () => {
  await getUserLocation();
  await updateMapUrl();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded">
    <h2>User Coordinates:</h2>
    <p>Latitude: {{ userLatitude }}</p>
    <p>Longitude: {{ userLongitude }}</p>
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
