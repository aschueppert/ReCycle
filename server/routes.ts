import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, BadgeGrouping, BinLocating, ClubGrouping, CosmeticGrouping, CosmeticLocating, Friending, Notifications, Plants, Points, Posting, Seeds, Sessioning, Streaks } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";

/**
 *
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    const user = await Authing.create(username, password);
    if (user.user) {
      await Promise.all([
        BadgeGrouping.createGroup("Badges", user.user._id),
        CosmeticGrouping.createGroup("Cosmetics", user.user._id),
        Streaks.create(user.user._id),
        Points.create(user.user._id),
        Seeds.create(user.user._id),
      ]);
    }
    return user;
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    await Promise.all([BadgeGrouping.deleteByAdmin(user), CosmeticGrouping.deleteByAdmin(user), Streaks.deleteByItem(user), Points.deleteByItem(user), Seeds.deleteByItem(user)]);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);

    // TODO: update user daily streaks here
    // const lastOnline = await Authing.getLastOnline(u._id);

    await Authing.updateLastOnline(u._id);

    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/bin")
  async locateBin(session: SessionDoc, lat: number, lng: number, item: string) {
    const user = Sessioning.getUser(session);
    const bin = await BinLocating.getNearestLocation(lat, lng, item);
    await Promise.all([Points.increase(user, 2), Seeds.increase(user, 2)]); //TODO: Badge
    return bin;
  }

  @Router.post("/bin")
  async addBin(session: SessionDoc, lat: number, lng: number, item: string) {
    const user = Sessioning.getUser(session);
    const bin = await BinLocating.createLocation(user, lat, lng, item);
    await Promise.all([Points.increase(user, 10), Seeds.increase(user, 10)]); //TODO: Badge
    return bin;
  }

  @Router.get("/plantlocations")
  async getPlants(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const plant = await CosmeticLocating.getLocations(user);
    return plant;
  }

  @Router.delete("/bin")
  async removeBin(session: SessionDoc, location: string) {
    const user = Sessioning.getUser(session);
    await BinLocating.deleteLocation(user, new ObjectId(location));
    return { msg: "Bin removed!" };
  }

  @Router.put("/bin")
  async updateBin(session: SessionDoc, location: string, lat: number, lng: number) {
    const user = Sessioning.getUser(session);
    return await BinLocating.changeLocation(user, lat, lng, new ObjectId(location));
  }

  @Router.put("/cosmetics/move")
  async moveCosmetic(session: SessionDoc, lat: number, lng: number, oldLocation: string) {
    const user = Sessioning.getUser(session);
    const bin = await CosmeticLocating.changeLocation(user, lat, lng, new ObjectId(oldLocation));
    await Promise.all([Points.increase(user, 5), Seeds.increase(user, 5)]); // TODO: Badge
    return bin;
  }
  /*

  @Router.get("/badges")
  async viewBadges(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const group = await BadgeGrouping.getGroup(user, "Badges");
    return await BadgeGrouping.getItems(user, group._id);
  }*/

  @Router.get("/cosmetics")
  async viewCosmetics(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const group = await CosmeticGrouping.getGroupByAdmin(user);
    if (!group) {
      return { msg: "Group not found!" };
    }

    let cosmetics = [];
    for (let item of group.items) {
      const cosmetic = await Plants.getById(item);
      cosmetics.push(cosmetic);
    }
    return cosmetics;
  }

  @Router.get("/allcosmetics")
  async viewAllCosmetics() {
    const cosmetics = await Plants.getAll();
    return cosmetics;
  }
  @Router.get("/club")
  async viewClubMembers(session: SessionDoc, group: string) {
    const user = Sessioning.getUser(session);
    const items = await ClubGrouping.getItems(user, new ObjectId(group));
    return { msg: "Succesfully retrieved items", items };
  }

  @Router.post("/club")
  async createClub(session: SessionDoc, name: string) {
    const user = Sessioning.getUser(session);
    const club = await ClubGrouping.createGroup(name, user);
    await Promise.all([Points.increase(user, 3), Seeds.increase(user, 3)]); // TODO: Badge
    return club;
  }

  @Router.delete("/club")
  async deleteClub(club: string) {
    return await ClubGrouping.deleteGroup(new ObjectId(club));
  }

  @Router.post("/club/member")
  async addClubMember(session: SessionDoc, group: string, member: string) {
    const user = Sessioning.getUser(session);
    const member_id = new ObjectId(member);
    const club = await ClubGrouping.addItem(new ObjectId(group), member_id);
    await Promise.all([Points.increase(user, 3), Seeds.increase(user, 3), Points.increase(member_id, 3), Seeds.increase(member_id, 3)]); // TODO: Badge
    return club;
  }

  @Router.delete("/club/member")
  async removeClubMember(group: string, member: string) {
    const member_id = new ObjectId(member);
    return await ClubGrouping.removeItem(new ObjectId(group), member_id);
  }

  @Router.post("/club/admin")
  async addClubAdmin(session: SessionDoc, group: string, admin: string) {
    const user = Sessioning.getUser(session);
    const admin_id = new ObjectId(admin);
    const club = await ClubGrouping.addAdmin(user, admin_id, new ObjectId(group));
    await Promise.all([Points.increase(user, 2), Seeds.increase(user, 2), Points.increase(admin_id, 2), Seeds.increase(admin_id, 2)]); // TODO: Badge
    return club;
  }
  /*
  @Router.delete("/club/admin")
  async removeClubAdmin(session: SessionDoc, group: string, admin: string) {
    const user = Sessioning.getUser(session);
    return await ClubGrouping.removeAdmin(user, new ObjectId(admin), new ObjectId(group));
  }*/

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Authing.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Authing.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Authing.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }
  @Router.post("/classify")
  async classify(session: SessionDoc) {
    console.log("classify");
    const user = Sessioning.getUser(session);
    await Points.increase(user, 4);
    await Seeds.increase(user, 4);
    return { msg: "Classified!" };
  }
  @Router.get("/seeds")
  async getSeeds(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const seeds = await Seeds.getValue(user);
    return seeds;
  }

  @Router.post("/purchase")
  async purchase(session: SessionDoc, item: string) {
    const user = Sessioning.getUser(session);

    const plant = await Plants.getByName(item);
    if (!plant) {
      return { msg: "Item not found!" };
    }
    await Seeds.decrease(user, plant.value);
    const group = await CosmeticGrouping.getGroupByAdmin(user);
    if (!group) {
      return { msg: "Group not found!" };
    }
    await CosmeticGrouping.addItem(group._id, plant._id);
    await CosmeticLocating.createLocation(user, 0, 0, plant.description);
    return { msg: "Purchased!" };
  }

  @Router.post("/notification/inactivity")
  async inactivityNotification(username: string) {
    const user = await Authing.getUserByUsername(username);

    const lastOnline = await Authing.getLastOnline(user._id);
    const now = new Date();
    const lastOnlineDate = new Date(lastOnline);
    const diff = now.getTime() - lastOnlineDate.getTime();
    const diffDays = diff / (1000 * 3600 * 24);
    if (diffDays > 3) {
      await Notifications.createNotification("ReCycle", user._id, "You have been inactive for a while. Please log in to keep your account active! <3");
      return { msg: "Inactivity notification sent." };
    } else {
      return { msg: "No inactivity notification needed." };
    }
  }

  @Router.post("/notification/bump")
  async bumpNotification(from: string, to: string) {
    const fromUser = await Authing.getUserByUsername(from);
    const toUser = await Authing.getUserByUsername(to);
    await Notifications.createNotification(fromUser._id, toUser._id, "Hey! Have you ReCycled today?");
    await Points.increase(fromUser._id, 2);
    await Seeds.increase(fromUser._id, 2);
    return { msg: "Bump notification sent." };
  }

  @Router.get("/notifications/incoming")
  async getIncomingNotifications(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Notifications.getIncomingNotifications(user);
  }

  @Router.get("/notifications/outgoing")
  async getOutgoingNotifications(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Notifications.getOutgoingNotifications(user);
  }

  @Router.delete("/notifications")
  async deleteNotification(_id: string) {
    return await Notifications.deleteNotification(new ObjectId(_id));
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
