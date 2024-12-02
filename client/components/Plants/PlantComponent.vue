<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

// Accessing the isLoggedIn state from the store

const { isLoggedIn } = storeToRefs(useUserStore());

const emit = defineEmits(["refresh"]);

// Reactive states
const loaded = ref(false);
// Trigger an action to buy a plant
async function buyPlant(item: string) {
  try {
    await fetchy(`/api/purchase`, "POST", { body: { item } });
    emit("refresh");
  } catch (_) {
    // Error handling
  }
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
    <p>2 Seeds</p>
    <i class="fas fa-seedling"></i>
    <button @click="buyPlant('flower')">grow</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid #000; /* Adjust the border color as needed */
  border-radius: 15px; /* Adjust the radius for rounded corners */
  padding: 5px; /* Optional, for spacing inside the border */
  width: 20%;
}
i {
  font-size: 3em;
  color: green;
}

button {
  margin-top: 1em;
}
</style>
