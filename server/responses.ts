import { Authing } from "./app";
import { ClassificationDoc } from "./concepts/classifying";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friending";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/posting";
import { ScoringDoc } from "./concepts/scoring";
import { Router } from "./framework/router";

/**
 * This class does   useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await Authing.getUserById(post.author);
    return { ...post, author: author.username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await Authing.idsToUsernames(posts.map((post) => post.author));
    return posts.map((post, i) => ({ ...post, author: authors[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await Authing.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  /**
   * Convert ClassificationDoc into more readable format for the frontend
   * by converting the user id into a username.
   */
  static async classification(classification: ClassificationDoc | null) {
    if (!classification) {
      return classification;
    }
    const user = await Authing.getUserById(classification.user);
    return { ...classification, user: user.username };
  }

  /**
   * Same as {@link classification} but for an array of ClassificationDoc for improved performance.
   */
  static async classifications(classifications: ClassificationDoc[]) {
    const users = await Authing.idsToUsernames(classifications.map((classification) => classification.user));
    return classifications.map((classification, i) => ({ ...classification, user: users[i] }));
  }

  /**
   * Convert ScoringDoc into more readable format for the frontend
   * by converting the item id into a username if the item is a user id.
   * Otherwise, it will return the item as is.
   */
  static async scoring(scoring: ScoringDoc | null) {
    if (!scoring) {
      return scoring;
    }
    try {
      const user = await Authing.getUserById(scoring.item);
      return { ...scoring, item: user.username };
    } catch {
      return scoring;
    }
  }

  /**
   * Same as {@link scoring} but for an array of ScoringDoc for improved performance.
   */
  static async scorings(scorings: ScoringDoc[]) {
    const users = await Authing.idsToUsernames(scorings.map((scoring) => scoring.item));
    return scorings.map((scoring, i) => ({ ...scoring, item: users[i] === "DELETED_USER" ? scoring.item : users[i] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.from), Authing.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([Authing.getUserById(e.user1), Authing.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
