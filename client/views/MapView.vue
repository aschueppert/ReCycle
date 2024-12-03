<script setup lang="ts">
import LocatingComponent from "@/components/Bins/LocatingComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <div class="min-h-screen flex items-center justify-center">
        <LocatingComponent />
      </div>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
