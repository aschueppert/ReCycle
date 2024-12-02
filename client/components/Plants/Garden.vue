<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

// Accessing the isLoggedIn state from the store
const { isLoggedIn } = storeToRefs(useUserStore());

// Reactive states
const loaded = ref(false);
const seeds = ref<number>(0);
const cosmetics = ref<{ long: number; lat: number; item: string }[]>([]);
const containerWidth = 600;
const containerHeight = 600;

// Fetch data
async function getSeeds() {
  try {
    const seedResults = await fetchy("/api/seeds", "GET", {});
    seeds.value = seedResults;
  } catch (_) {
    seeds.value = 0;
  }
}

async function getPlantLocations() {
  try {
    const cosmeticsResults = await fetchy("/api/plantlocations", "GET", {});
    cosmetics.value = cosmeticsResults;
  } catch (e) {
    console.log(e);
  }
}

// Fetch scores when the component mounts
onBeforeMount(async () => {
  await getSeeds();
  await getPlantLocations();
  loaded.value = true;
});

// Dragging functionality
let draggedItem = ref<{ index: number; offsetX: number; offsetY: number } | null>(null);

function onMouseDown(event: MouseEvent, index: number) {
  const item = cosmetics.value[index];
  const containerRect = (event.target as HTMLElement).closest(".icons")!.getBoundingClientRect();
  const itemX = item.long * containerWidth;
  const itemY = item.lat * containerHeight;

  draggedItem.value = {
    index,
    offsetX: event.clientX - (containerRect.left + itemX),
    offsetY: event.clientY - (containerRect.top + itemY),
  };
}

function onMouseMove(event: MouseEvent) {
  if (draggedItem.value !== null) {
    const { index, offsetX, offsetY } = draggedItem.value;
    const containerRect = (event.target as HTMLElement).closest(".icons")!.getBoundingClientRect();

    // Calculate new positions relative to the container
    const newX = (event.clientX - containerRect.left - offsetX) / containerWidth;
    const newY = (event.clientY - containerRect.top - offsetY) / containerHeight;

    // Clamp the values to keep items within the container
    cosmetics.value[index].long = Math.max(0, Math.min(newX, 1));
    cosmetics.value[index].lat = Math.max(0, Math.min(newY, 1));
  }
}

function onMouseUp() {
  draggedItem.value = null;
}
</script>

<template>
  <article v-if="loaded">
    <p>{{ seeds }} Seeds</p>
    <div class="icons" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp">
      <div
        v-for="(item, index) in cosmetics"
        :key="index"
        :style="{
          position: 'absolute',
          left: item.long * containerWidth + 'px',
          top: item.lat * containerHeight + 'px',
        }"
        @mousedown="onMouseDown($event, index)"
      >
        <i v-if="item" :class="item.item"></i>
      </div>
    </div>
  </article>
</template>

<style scoped>
.icons {
  position: relative;
  width: 600px;
  height: 600px;
  background-color: lightgreen;
  font-size: 3em;
  color: green;
}
</style>
