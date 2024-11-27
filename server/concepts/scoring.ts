import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

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

  async increase(item: ObjectId, increase: number) {
    const score = await this.scores.readOne({ item });
    if (!score) {
      throw new Error("Score not found!");
    }
    console.log(score);
    let current_value = score.value;
    let value = current_value + increase;
    await this.scores.partialUpdateOne({ item }, { value });
    return { msg: "Score successfully updated!" };
  }

  async decrease(item: ObjectId, decrease: number) {
    const score = await this.scores.readOne({ item });
    if (!score) {
      throw new NotAllowedError("Score not found!");
    }

    console.log(score);
    let current_value = score.value;
    if (current_value < decrease) {
      throw new NotAllowedError("Score too small");
    }
    let value = current_value - decrease;
    await this.scores.partialUpdateOne({ item }, { value });
    return { msg: "Score successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.scores.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }
}
