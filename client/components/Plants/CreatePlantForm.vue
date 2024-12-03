<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const value = ref(0);
const description = ref("");

const emit = defineEmits(["refreshPlants"]);

const createPlant = async (name: string, value: number, description: string) => {
  try {
    await fetchy("/api/plants", "POST", {
      body: { name, value, description },
    });
  } catch (_) {
    return;
  }
  emit("refreshPlants");
  emptyForm();
};

const emptyForm = () => {
  description.value = "";
  value.value = 0;
  name.value = "";
};
</script>

<template>
  <form @submit.prevent="createPlant(name, value, description)">
    <textarea id="name" v-model="name" placeholder="name" required> </textarea>
    <textarea id="value" v-model="value" placeholder="value" required> </textarea>
    <textarea id="description" v-model="description" placeholder="description" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Plant</button>
  </form>
</template>

<style scoped>
form {
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 2em;
  padding: 0.5em;
  resize: none;
}
</style>
