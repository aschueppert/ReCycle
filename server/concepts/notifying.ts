import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface NotificationDoc extends BaseDoc {
  message: string;
  timestamp: Date;
  from: ObjectId | string;
  to: ObjectId;
}

/**
 * concept: Notifying
 */
export default class NotifyingConcept {
  public readonly users: DocCollection<NotificationDoc>;

  /**
   * Make an instance of Notifying.
   */
  constructor(collectionName: string) {
    this.users = new DocCollection<NotificationDoc>(collectionName);

    // Create index on username to make search queries for it performant
    void this.users.collection.createIndex({ username: 1 });
  }

  async createNotification(from: ObjectId | string, to: ObjectId, message: string) {
    const _id = await this.users.createOne({ from, to, message, timestamp: new Date() });
    return { msg: "Notification successfully created!", notification: await this.users.readOne({ _id }) };
  }

  async getIncomingNotifications(user: ObjectId) {
    return await this.users.readMany({ to: user });
  }

  async getOutgoingNotifications(user: ObjectId) {
    return await this.users.readMany({ from: user });
  }

  async deleteNotification(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "Deleted notification!" };
  }
}
