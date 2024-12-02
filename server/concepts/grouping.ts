import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface GroupDoc extends BaseDoc {
  name: string;
  admins: Array<ObjectId>;
  items: ObjectId[];
}

/**
 * concept: Grouping [User, Item]
 */
export default class GroupingConcept {
  public readonly groups: DocCollection<GroupDoc>;

  /**
   * Make an instance of Grouping.
   */
  constructor(collectionName: string) {
    this.groups = new DocCollection<GroupDoc>(collectionName);
  }

  async createGroup(name: string, admin: ObjectId) {
    const admins = new Array(admin);
    const _id = await this.groups.createOne({ name, admins, items: [] });
    return { msg: "Group successfully created!", group: await this.groups.readOne({ _id }) };
  }

  async deleteGroup(_id: ObjectId) {
    await this.groups.popOne({ _id });
    return { msg: "Group deleted successfully!" };
  }
  async getGroupByAdmin(admin: ObjectId) {
    //find group where user is in admins
    return await this.groups.readOne({ admins: [admin] });
  }
  async getGroups() {
    return await this.groups.readMany({});
  }

  async addItem(group: ObjectId, item: ObjectId) {
    const groupDoc = await this.groups.readOne({ _id: group });
    if (groupDoc == null) {
      throw new NotFoundError("Group not found!");
    }

    groupDoc.items.push(item);

    await this.groups.partialUpdateOne({ _id: group }, { items: groupDoc.items });
    return { msg: "Account added to group successfully!" };
  }

  async removeItem(group: ObjectId, item: ObjectId) {
    const groupDoc = await this.groups.readOne({ _id: group });
    if (groupDoc == null) {
      throw new NotFoundError("Group not found!");
    }

    // remove item from group
    const index = groupDoc.items.map((item) => item.toString()).indexOf(item.toString());
    if (index === -1) {
      throw new NotAllowedError("Item not in group!");
    }

    groupDoc.items.splice(index, 1);

    await this.groups.partialUpdateOne({ _id: group }, { items: groupDoc.items });
    return { msg: "Item removed from group successfully!" };
  }

  async addAdmin(current_admin: ObjectId, user: ObjectId, group_id: ObjectId) {
    const group = await this.groups.readOne({ _id: group_id });
    if (group == null) {
      throw new NotFoundError("Group not found!");
    }

    if (!group.admins.includes(current_admin)) {
      throw new NotAllowedError("User cannot add an admin");
    }

    group.admins.push(user);
    await this.groups.partialUpdateOne({ _id: group._id }, { admins: group.admins });
    return { msg: "Admin added to group successfully!" };
  }
  /*
  async removeAdmin(current_admin: ObjectId, to_delete: ObjectId, group_id: ObjectId) {
    const group = await this.groups.readOne({ _id: group_id });
    if (group == null) {
      throw new NotFoundError("Group not found!");
    }

    if (!group.admins.includes(current_admin)) {
      throw new NotAllowedError("User cannot add an admin");
    }

    if (group.admins.delete(to_delete)) {
      await this.groups.partialUpdateOne({ _id: group._id }, { admins: group.admins });
      return { msg: "Admin deleted from group successfully!" };
    } else {
      return { msg: "Provided user is not an admin of group " + name + "!" };
    }
  }*/

  async getItems(admin: ObjectId, group: ObjectId) {
    const groupDoc = await this.groups.readOne({ _id: group });
    if (groupDoc == null) {
      throw new NotFoundError("Group not found!");
    }

    if (!groupDoc.admins.includes(admin)) {
      throw new NotAllowedError("User is not an admin of this group!");
    }

    return groupDoc.items;
  }
}
