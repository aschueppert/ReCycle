<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const GOOGLE_MAP_API_KEY = "AIzaSyDqYZHShrNYA5aDPkiOfq2I5iEOcUBUKnw";

const loaded = ref(false);

const userLatitude = ref(36.7783); // Default latitude
const userLongitude = ref(-119.4179); // Default longitude
const destinationLatitude = ref(-33.8688); // Default latitude
const destinationLongitude = ref(151.2093); // Default longitude

const binType = ref<"trash" | "recycle">("trash");
const mapMode = ref<"view" | "directions">("view");
const mapUrl = ref("");

async function updateMapUrl() {
  if (mapMode.value === "view") {
    mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&center=${userLatitude.value},${userLongitude.value}&zoom=5`;
  } else {
    mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&origin=${userLatitude.value},${userLongitude.value}&destination=${destinationLatitude.value},${destinationLongitude.value}&zoom=5`;
  }
  console.log("===============================================================");
  console.log("user latitude: ", userLatitude.value);
  console.log("user longitude: ", userLongitude.value);
  console.log("destination latitude: ", destinationLatitude.value);
  console.log("destination longitude: ", destinationLongitude.value);
  console.log("bin type: ", binType.value);
  console.log("map mode: ", mapMode.value);
  console.log("map url: ", mapUrl.value);
  console.log("==============================================================");
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
    console.log("Error fetching nearest bin.");
  }
}

async function addBin(lat: number, lng: number, item: string) {
  try {
    await fetchy(`/api/bin`, "POST", {
      body: {
        lat,
        lng,
        item,
      },
    });
  } catch (_) {
    return;
  }
}

async function locateBin() {
  await getNearestBin();
  mapMode.value = "directions";
  await updateMapUrl();
}

async function handleBinTypeChange(type: "trash" | "recycle") {
  binType.value = type;
  await locateBin();
}

onBeforeMount(async () => {
  await getUserLocation();
  await updateMapUrl();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded">
    <div>
      <button @click="handleBinTypeChange('trash')">Get Nearest Trash Bin</button>
      <button @click="handleBinTypeChange('recycle')">Get Nearest Recycle Bin</button>
    </div>
    <p>User Latitude: {{ userLatitude }}</p>
    <p>User Longitude: {{ userLongitude }}</p>
    <p>Destination Latitude: {{ destinationLatitude }}</p>
    <p>Destination Longitude: {{ destinationLongitude }}</p>
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
button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
