<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";

// Accessing the isLoggedIn state from the store

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["item"]);
const emit = defineEmits(["refresh"]);

// Reactive states
const loaded = ref(false);
// Trigger an action to buy a plant
async function buyPlant(item: string) {
  try {
    await fetchy(`/api/purchase`, "POST", { body: { item } });
    void router.push({ name: "Garden" });
    emit("refresh");
  } catch (_) {
    // Error handling
  }
}

function getImagePath(item: string) {
  const paths: { [key: string]: string } = {
    "1.png": "@/assets/images/1.png",
    "2.png": "@/assets/images/2.png",
    "8.png": "@/assets/images/8.png",
    "3.png": "@/assets/images/3.png",
    "4.png": "@/assets/images/4.png",
    "5.png": "@/assets/images/5.png",
    "6.png": "@/assets/images/6.png",
    "7.png": "@/assets/images/7.png",
    "9.png": "@/assets/images/9.png",
  };
  console.log(paths[item]);
  return paths[item];
}
// Fetch scores when the component mounts
onBeforeMount(async () => {
  loaded.value = true;
});
</script>

<template>
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  </head>
  <section v-if="loaded">
    <img v-if="props.item != null" :src="item.description" alt="Flower" />
    <button class="button" @click="buyPlant(props.item.name)">Buy with {{ props.item.value }} {{ props.item.value == 1 ? "Seed" : "Seeds" }}</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid #044120; /* Dark green border */
  border-radius: 20px;
  padding: 20px; /* Increased for better spacing */
  width: 20%; /* Adjusted width for better balance */
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease; /* Smooth hover effect */
}

section:hover {
  transform: scale(1.025); /* Slight scaling on hover */
  background-color: #eafeea; /* Light green background */
}
img {
  width: 80px; /* Larger image */
  height: 100px;
  margin-bottom: 10px;
  transition: transform 0.2s ease; /* Smooth scaling on hover */
}

img:hover {
  transform: scale(1.1); /* Slightly larger image on hover */
}
</style>
