<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);

// props
const props = defineProps(["coords"]);

onBeforeMount(async () => {
  loaded.value = true;
});
</script>

<template>
  <p v-if="props.coords.lat !== undefined && props.coords.lat !== undefined">{{ props.coords.lat }}, {{ props.coords.lng }}</p>
  <p v-else><i>no coordinates yet</i></p>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d737.0564543032173!2d-71.09591907310144!3d42.35902653256371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370aa862b3beb%3A0x487c37ec53df273!2sStratton%20Student%20Center!5e0!3m2!1sen!2sus!4v1733192356213!5m2!1sen!2sus"
    width="600"
    height="450"
    style="border-width: 0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
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

p {
  text-align: center;
}
</style>
