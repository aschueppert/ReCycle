<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="button">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
  color: #044120;
}

label {
  border: none;
  color: #044120;
}
input {
  color: #044120;
}

/* Style for the input */
input[type="text"],
input[type="password"] {
  padding: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 15px; /* Rounded corners */
  border: 2px solid #000000; /* Black border */
  font-size: 1em;
  resize: none;
  outline: none;
  margin-right: 0.5em;
  border-color: #000000; /* Black border */
  transition:
    box-shadow 0.3s,
    border-color 0.3s; /* Smooth transition for border color */
}

/* Focus effect for input */
input[type="text"]:focus,
input[type="password"]:focus {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5); /* Smooth outer glow effect */
  border-color: #044120; /* Change color on focus */
  transition:
    box-shadow 0.3s,
    border-color 0.3s; /* Smooth transition for the shadow effect */
}

input:required:invalid {
  color: black;
}

/* Style for the button */
button[type="submit"] {
  padding: 0.5em 1em;
  border-radius: 40px; /* Rounded corners */
  background-color: #044120;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

/* Hover effect for button */
button[type="submit"]:hover {
  background-color: #056635;
}
</style>
