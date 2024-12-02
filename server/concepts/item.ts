import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface ItemDoc extends BaseDoc {
  value: number;
  name: string;
  description: string;
}

export default class ItemConcept {
  public readonly items: DocCollection<ItemDoc>;

  constructor(collectionName: string) {
    this.items = new DocCollection<ItemDoc>(collectionName);
  }

  async create(value: number, name: string, description: string) {
    const _id = await this.items.createOne({ value, name, description });
    return { msg: "Item successfully created!", item: await this.items.readOne({ _id }) };
  }

  async getByName(name: string) {
    const item = await this.items.readOne({ name });
    return item;
  }
  async getById(_id: ObjectId) {
    const item = await this.items.readOne({ _id });
    return item;
  }
  async getAll() {
    return await this.items.readMany({});
  }
}
