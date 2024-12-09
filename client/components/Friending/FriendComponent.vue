<script setup lang="ts">
import { useFriendRequestsStore, useFriendsStore } from "@/stores/friend";
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
    await fetchy(`/api/friend/requests/${props.username}`, "POST", { alert: true });
  } catch (_) {
    return;
  }
};

const deleteRequest = async () => {
  try {
    await fetchy(`/api/friend/requests/${props.username}`, "DELETE", { alert: true });
  } catch (_) {
    return;
  }
};

const deleteFriend = async () => {
  try {
    await fetchy(`/api/friends/${props.username}`, "DELETE", { alert: true });
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

const removeFriend = async () => {
  await deleteFriend();
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
    <button class="friend-button" @click="removeFriend">Unfriend</button>
  </div>
</template>

<style>
.friend-button {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  background-color: #121212;
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.friend-button:hover {
  background-color: #4a4a4a;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.friend-button:active {
  background-color: #0f0f0f;
  transform: translateY(1px);
}

.friend-button:focus {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
</style>
