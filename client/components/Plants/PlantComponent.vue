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
    <p>{{ props.item.value }} Seeds</p>
    <img v-if="props.item != null" :src="'client/components/Plants/' + props.item.description" />
    <button @click="buyPlant(props.item.name)">grow</button>
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
img {
  width: 50px;
  height: 70px;
}
button {
  margin-top: 1em;
}
</style>
