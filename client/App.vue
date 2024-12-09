<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <head>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
    </head>
    <nav>
      <div class="title title-option">
        <i class="fa fa-recycle"></i>
        <RouterLink :to="{ name: 'Home' }">
          <h1 :class="{ underline: currentRouteName == 'Home' }">ReCycle</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Map' }" :class="['menu-option', { underline: currentRouteName == 'Map' }]"> Map</RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Garden' }" :class="['menu-option', { underline: currentRouteName == 'Garden' }]"> Garden</RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Friends' }" :class="['menu-option', { underline: currentRouteName == 'Friends' }]"> Friends </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Social' }" :class="['menu-option', { underline: currentRouteName == 'Social' }]"> Social </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile' }" :class="['menu-option', { underline: currentRouteName == 'Profile' }]"> Profile</RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="['menu-option', { underline: currentRouteName == 'Login' }]"> Login to Use All Features</RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";
* {
  font-family: var(--base-font);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
i {
  font-size: 3em;
  color: green;
}
nav {
  padding: 1em 2em;
  background-color: #d5f7d5;
  display: flex;
  align-items: center;
  border-bottom: 4px solid #044120;
}

h1 {
  color: #044120;
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: #044120;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}

.menu-option {
  display: inline-block;
  cursor: pointer;
  transition:
    transform 0.3s,
    filter 0.3s;
}
.menu-option:hover {
  text-decoration: underline;
  transform: scale(1.05); /* Slight scaling on hover */
  filter: drop-shadow(0px 0px 5px #cccccc); /* Add a shadow on hover */
  transition:
    filter 0.3s,
    transform 0.3s;
}
.menu-option:active {
  transform: scale(0.95); /* Slight scaling on click */
}

.title-option {
  cursor: pointer;
  transition:
    transform 0.3s,
    filter 0.3s;
}
.title-option:hover {
  text-decoration: none;
  transform: scale(1.05); /* Slight scaling on hover */
  filter: drop-shadow(0px 0px 5px #cccccc); /* Add a shadow on hover */
  transition:
    filter 0.3s,
    transform 0.3s;
}
.title-option:active {
  transform: scale(0.95); /* Slight scaling on click */
}
</style>
