<script setup lang="ts">
import { useFriendsStore, useFriendRequestsStore } from "@/stores/friend";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";

const friendsStore = useFriendsStore();
const { friends } = storeToRefs(useFriendsStore());

const friendRequestsStore = useFriendRequestsStore();
const { friendRequests } = storeToRefs(useFriendRequestsStore());

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["username"]);

const loaded = ref(false);
const friending = ref<boolean | null>(null);
const friendRequesting = ref<boolean | null>(null);

const getFriendStatus = async () => {
  for (const friend of friends.value) {
    if ((friend.user1 === props.username && friend.user2 === currentUsername.value) || (friend.user2 === props.username && friend.user1 === currentUsername.value)) {
      friending.value = true;
      return;
    }
  }
  friending.value = false;
};

const getRequestStatus = async () => {
  for (const friendRequest of friendRequests.value) {
    if (friendRequest.to === props.username && friendRequest.from === currentUsername.value) {
      friendRequesting.value = true;
      return;
    }
    friendRequesting.value = false;
  }
};

const sendRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${props.username}`, "POST");
  } catch (_) {
    return;
  }
};

const deleteRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${props.username}`, "DELETE");
  } catch (_) {
    return;
  }
};

const deleteFriend = async () => {
  try {
    await fetchy(`/api/friends/${props.username}`, "DELETE");
  } catch (_) {
    return;
  }
};

const toggleFriend = async () => {
  if (friending.value === true) {
    friending.value = false;
    await deleteFriend();
  } else if (friendRequesting.value === true) {
    friendRequesting.value = false;
    await deleteRequest();
  } else if (friendRequesting.value === false) {
    friendRequesting.value = true;
    await sendRequest();
  }
  await friendsStore.getFriends();
  await friendRequestsStore.getFriendRequests();
};

onBeforeMount(async () => {
  await friendsStore.getFriends();
  await friendRequestsStore.getFriendRequests();
  await getFriendStatus();
  await getRequestStatus();
  loaded.value = true;
});

watch(
  () => friends.value,
  async () => {
    await getFriendStatus();
  },
);

watch(
  () => friendRequests.value,
  async () => {
    await getRequestStatus();
  },
);
</script>

<template>
  <div v-if="loaded && isLoggedIn && currentUsername !== props.username">
    <button class="friend-button" @click="toggleFriend">
      {{ friending ? "Unfriend" : friendRequesting ? "Request" : "Cancel" }}
    </button>
  </div>
</template>

<style>
.friend-button {
  display: inline-block;
  padding: 6px 12px;
  font-size: 12px;
  background-color: #050303;
  color: #ffffff;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  transition: background-color 0.3s ease;
}

.friend-button:hover {
  background-color: #343434;
}
</style>
