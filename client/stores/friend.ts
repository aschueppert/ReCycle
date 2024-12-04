import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFriendsStore = defineStore(
  "friends",
  () => {
    const friends = ref<Array<Record<string, string>>>([]);

    const getFriends = async () => {
      try {
        const friendResults = await fetchy("/api/friends/", "GET", { alert: false });
        friends.value = friendResults;
      } catch (_) {
        return;
      }
    };

    return {
      friends,
      getFriends,
    };
  },
  { persist: true },
);

export const useFriendRequestsStore = defineStore(
  "friendRequests",
  () => {
    const friendRequests = ref<Array<Record<string, string>>>([]);

    const getFriendRequests = async () => {
      try {
        const friendRequestResults = await fetchy("/api/friends/requests", "GET", { alert: false });
        friendRequests.value = friendRequestResults;
      } catch (_) {
        return;
      }
    };

    return {
      friendRequests,
      getFriendRequests,
    };
  },
  { persist: true },
);
