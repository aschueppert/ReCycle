<script setup lang="ts">
import AddFriendComponent from "@/components/Friending/AddFriendComponent.vue";
import FriendRequestListComponent from "@/components/Friending/FriendRequestListComponent.vue";
</script>

<template>
  <div class="add-friend-view">
    <div class="search-container">
      <AddFriendComponent />
    </div>
    <div class="requests-container">
      <FriendRequestListComponent />
    </div>
  </div>
</template>

<style scoped>
.add-friend-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(45deg, #f9fdfb, #e6f7f0);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
