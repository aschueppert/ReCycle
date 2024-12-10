<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

const loaded = ref(false);
const showContributeForm = ref(false);
const useCurrentLocation = ref(false);

const userLatitude = ref(36.7783); // Default latitude
const userLongitude = ref(-119.4179); // Default longitude
const destinationLatitude = ref(-33.8688); // Default latitude
const destinationLongitude = ref(151.2093); // Default longitude
const positionOptions = {
  enableHighAccuracy: false,
  maximumAge: 300000, // 5 minutes cache
};

const binType = ref<"trash" | "recycle">("trash");
const mapMode = ref<"view" | "directions">("view");
const mapUrl = ref("");

const formLat = ref("");
const formLng = ref("");
const formItem = ref("");
const formError = ref("");

// function updateMapUrl() {
// if (mapMode.value === "view") {
//   mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&center=${userLatitude.value},${userLongitude.value}&zoom=17`;
// } else {
//   mapUrl.value = `https://www.google.com/maps/embed/v1/${mapMode.value}?key=${GOOGLE_MAP_API_KEY}&origin=${userLatitude.value},${userLongitude.value}&destination=${destinationLatitude.value},${destinationLongitude.value}`;
// }
// }

async function updateMapUrl() {
  try {
    console.log("Fetching map URL...");
    const mapResult = await fetchy(`/api/map`, "GET", {
      query: {
        mapMode: mapMode.value,
        userLatitude: userLatitude.value.toString(),
        userLongitude: userLongitude.value.toString(),
        destinationLatitude: destinationLatitude.value.toString(),
        destinationLongitude: destinationLongitude.value.toString(),
      },
    });
    console.log("mapResult", mapResult);
    mapUrl.value = mapResult.mapUrl;
  } catch (_) {
    console.log("Error fetching map URL.");
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
        positionOptions,
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
      alert: true,
    });
    console.log("Bin added successfully");
    showContributeForm.value = false; // Hide form after successful submission
    formLat.value = "";
    formLng.value = "";
    formItem.value = "";
    useCurrentLocation.value = false;
  } catch (_) {
    console.log("Error adding bin.");
  }
}

async function submitBin(type: "trash" | "recycle") {
  let lat: number, lng: number;

  formError.value = "";

  if (useCurrentLocation.value) {
    lat = userLatitude.value;
    lng = userLongitude.value;
  } else {
    if (!formLat.value || isNaN(parseFloat(formLat.value)) || !formLng.value || isNaN(parseFloat(formLng.value))) {
      formError.value = "Please provide valid latitude and longitude values.";
      return;
    }
    lat = parseFloat(formLat.value);
    lng = parseFloat(formLng.value);
  }

  await addBin(lat, lng, type);

  destinationLatitude.value = lat;
  destinationLongitude.value = lng;
  mapMode.value = "directions";
  await updateMapUrl();
}

async function getNearestBin() {
  try {
    const result = await fetchy(`/api/bin/${userLatitude.value}/${userLongitude.value}/${binType.value}`, "GET", { alert: false });
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

function toggleContributeForm() {
  showContributeForm.value = !showContributeForm.value;
}

function toggleCurrentLocation(event: Event) {
  event.preventDefault(); // Prevent accidental form submission
  useCurrentLocation.value = !useCurrentLocation.value;

  // Reset form fields when toggling
  if (useCurrentLocation.value) {
    formLat.value = "";
    formLng.value = "";
  }
}

onBeforeMount(async () => {
  try {
    console.log("Fetching user location...");
    await getUserLocation();
    console.log("User location fetched successfully.");
    await updateMapUrl();
    loaded.value = true;
  } catch (error) {
    console.log("Error during setup:", error);
    loaded.value = true;
  }
});
</script>

<template>
  <div class="container" v-if="loaded">
    <button @click="toggleContributeForm" class="button" v-if="isLoggedIn">
      {{ showContributeForm ? "Cancel" : "Add a bin!" }}
    </button>

    <form v-if="showContributeForm && isLoggedIn" class="contribute-form">
      <h2>Add a New Bin</h2>

      <div class="current-location-toggle">
        <button @click="toggleCurrentLocation($event)" :class="{ active: useCurrentLocation }" class="button">
          {{ useCurrentLocation ? "Use Coordinates" : "Use Current Location" }}
        </button>
      </div>

      <div v-if="!useCurrentLocation" class="coordinate-inputs">
        <div>
          <label for="lat">Latitude:</label>
          <input id="lat" v-model="formLat" type="text" />
        </div>
        <div>
          <label for="lng">Longitude:</label>
          <input id="lng" v-model="formLng" type="text" />
        </div>
      </div>

      <div v-else class="current-location-display">
        <p>Latitude: {{ userLatitude.toFixed(4) }}</p>
        <p>Longitude: {{ userLongitude.toFixed(4) }}</p>
      </div>

      <div class="bin-type-buttons">
        <button class="button" @click.prevent="submitBin('trash')">Add Trash Bin</button>
        <button class="button" @click.prevent="submitBin('recycle')">Add Recycle Bin</button>
      </div>

      <p v-if="formError" class="form-error-message">{{ formError }}</p>
    </form>

    <div v-if="mapUrl" class="map-section">
      <div class="bin-type-buttons">
        <button class="button" @click="handleBinTypeChange('trash')">Nearest 🗑️ Trash Bin</button>
        <button class="button" @click="handleBinTypeChange('recycle')">Nearest ♻️ Recycle Bin</button>
      </div>
      <iframe :src="mapUrl" :key="mapUrl" width="600" height="450" class="map-iframe" loading="lazy" allowfullscreen></iframe>
    </div>
    <div v-else class="error-message">
      <p>Geolocation is not currently enabled or supported by this browser.</p>
    </div>
  </div>
  <div v-else class="loading-message">
    <p>Fetching your location...</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
}

h2 {
  color: #044120;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.contribute-btn {
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #55c58a, #44b076, #3caf72);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.contribute-btn:hover {
  background: linear-gradient(45deg, #3caf72, #44b076, #55c58a);
  transform: translateY(-3px);
}

.contribute-form {
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  padding: 0px 40px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.contribute-form input[type="text"] {
  margin: 0 auto; /* Center-align the inputs */
}

.coordinate-inputs div,
.contribute-form > div {
  margin-bottom: 15px;
}

.contribute-form label {
  display: block;
  color: #333;
  font-weight: bold;
  margin-bottom: 8px;
}

.contribute-form input[type="text"] {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.current-location-display {
  background-color: #f9fff9;
  padding: 10px;
  border: 1px solid #44b076;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #333;
}

.location-toggle-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(45deg, #55c58a, #44b076, #3caf72);
  color: white;
  border: none;
  border-radius: 25px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.location-toggle-btn.active {
  background: #44b076;
}

.location-toggle-btn:hover {
  transform: scale(1.05);
}

.bin-type-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 20px;
}

.map-section iframe {
  margin-top: 10px;
  width: 100%;
  height: calc(100vh - 270px); /* Dynamically adjust height (subtracting space for other elements) */
  border-radius: 20px;
  border: 4px solid #044120; /* Subtle border for clean design */
}

.form-error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.error-message,
.loading-message {
  text-align: center;
  font-size: 18px;
  color: #555;
  margin-top: 20px;
}
</style>
