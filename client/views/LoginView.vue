<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="column">
    <h1>Login or register to use all features!</h1>
    <LoginForm />
    <RegisterForm />
  </main>
</template>

<style scoped>
h1 {
  color: #044120;
  margin-bottom: 0.5em;
}
</style>
