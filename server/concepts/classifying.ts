import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface ClassificationDoc extends BaseDoc {
  item: string;
  type: string;
  user: ObjectId;
}

/**
 * concept: Classifying [User]
 */
export default class ClassifyingConcept {
  public readonly classifications: DocCollection<ClassificationDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.classifications = new DocCollection<ClassificationDoc>(collectionName);
  }

  async createClassification(item: string, type: string, user: ObjectId) {
    const _id = await this.classifications.createOne({ item, type, user });
    return { msg: "Classification successfully created!", classification: await this.classifications.readOne({ _id }) };
  }

  async getClassifications() {
    return await this.classifications.readMany({}, { sort: { _id: -1 } });
  }

  async getClassificationsByUser(user: ObjectId) {
    return await this.classifications.readMany({ user });
  }

  async deleteClassification(_id: ObjectId) {
    await this.classifications.deleteOne({ _id });
    return { msg: "Classification deleted successfully!" };
  }
}
