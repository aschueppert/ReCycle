<script setup lang="ts">
import BinComponent from "@/components/Bins/BinComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <div class="min-h-screen flex items-center justify-center">
        <BinComponent />
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
