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

const formLat = ref("");
const formLng = ref("");
const formItem = ref("");

function updateMapUrl() {
  if (mapMode.value === "view") {
    mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&center=${userLatitude.value},${userLongitude.value}&zoom=17`;
  } else {
    mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&origin=${userLatitude.value},${userLongitude.value}&destination=${destinationLatitude.value},${destinationLongitude.value}`;
  }
}

async function getUserLocation() {
  return new Promise<void>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLatitude.value = pos.coords.latitude;
          userLongitude.value = pos.coords.longitude;
          resolve();
        },
        (err) => {
          console.log("Geolocation error:", err.message);
          reject(err);
        },
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject(new Error("Geolocation not supported"));
    }
  });
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
    console.log("Bin added successfully");
  } catch (_) {
    console.log("Error adding bin.");
  }
}

async function handleSubmit() {
  if (formLat.value && formLng.value && formItem.value) {
    const lat = parseFloat(formLat.value);
    const lng = parseFloat(formLng.value);
    const item = formItem.value;
    await addBin(lat, lng, item);
    formLat.value = "";
    formLng.value = "";
    formItem.value = "";
  } else {
    console.log("Please fill all fields.");
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

async function handleBinTypeChange(type: "trash" | "recycle") {
  binType.value = type;
  await getNearestBin();
  mapMode.value = "directions";
  await updateMapUrl();
}

onBeforeMount(async () => {
  try {
    await getUserLocation();
    updateMapUrl();
    loaded.value = true;
  } catch (error) {
    console.log("Error during setup:", error);
    loaded.value = true;
  }
});
</script>

<template>
  <div v-if="loaded && mapUrl">
    <div>
      <button @click="handleBinTypeChange('trash')">Get Nearest Trash Bin</button>
      <button @click="handleBinTypeChange('recycle')">Get Nearest Recycle Bin</button>
    </div>
    <iframe :src="mapUrl" :key="mapUrl" width="600" height="450" style="border: 0" loading="lazy"></iframe>

    <h2>Add a New Bin</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="lat">Latitude:</label>
        <input id="lat" v-model="formLat" type="text" />
      </div>
      <div>
        <label for="lng">Longitude:</label>
        <input id="lng" v-model="formLng" type="text" />
      </div>
      <div>
        <label for="item">Item:</label>
        <input id="item" v-model="formItem" type="text" />
      </div>
      <button type="submit">Add Bin</button>
    </form>
  </div>
  <div v-else-if="loaded">
    <p>Geolocation is not supported by this browser.</p>
  </div>
  <div v-else>
    <p>Loading map...</p>
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
form {
  margin-top: 20px;
}
form div {
  margin-bottom: 10px;
}
label {
  display: inline-block;
  width: 100px;
}
input {
  padding: 5px;
  font-size: 14px;
}
</style>
