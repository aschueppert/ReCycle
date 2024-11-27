import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface ScoringDoc extends BaseDoc {
  item: ObjectId;
  value: number;
}

/**
 * concept: Scoring [Item]
 */
export default class ScoringConcept {
  public readonly scores: DocCollection<ScoringDoc>;

  /**
   * Make an instance of Scoring.
   */
  constructor(collectionName: string) {
    this.scores = new DocCollection<ScoringDoc>(collectionName);
  }

  async create(item: ObjectId) {
    const value = 0;
    const _id = await this.scores.createOne({ item, value });
    return { msg: "Score successfully created!", post: await this.scores.readOne({ _id }) };
  }

  async getValue(item: ObjectId) {
    return await this.scores.readOne({ item });
  }

  async increase(item: ObjectId, value: number) {
    const id = this.scores.readOne({ item });
    await this.scores.partialUpdateOne({ id }, { value });
    return { msg: "Score successfully updated!" };
  }

  async decrease(item: ObjectId, value: number) {
    const id = this.scores.readOne({ item });
    await this.scores.partialUpdateOne({ id }, { value });
    return { msg: "Score successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.scores.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }
}
