import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface LocatingDoc extends BaseDoc {
  user: ObjectId;
  lat: number;
  long: number;
  item: string;
}

/**
 * concept: Locating [Coordinates]
 */
export default class LocatingConcept {
  public readonly locations: DocCollection<LocatingDoc>;

  /**
   * Make an instance of Locating.
   */
  constructor(collectionName: string) {
    this.locations = new DocCollection<LocatingDoc>(collectionName);
  }

  async createLocation(user: ObjectId, lat: number, long: number, item: string) {
    const _id = await this.locations.createOne({ user, lat, long, item });
    return { msg: "Location successfully created!", location: await this.locations.readOne({ _id }) };
  }

  async changeLocation(user: ObjectId, lat: number, long: number, location: ObjectId) {
    await this.locations.partialUpdateOne({ _id: location, user }, { lat, long });
    return { msg: "Location successfully updated!", location: await this.locations.readOne({ _id: location }) };
  }

  async getNearestLocation(lat: number, long: number, item: string) {
    const locations = await this.locations.readMany({});

    // use euclidean distance between currrent lat/long and each location to get the nearest
    let nearest: { lat: number; lng: number } | undefined = undefined;
    let minDistance = Infinity;
    for (const location of locations) {
      console.log("location", location);
      if (location.item == item) {
        const distance = Math.hypot(lat - location.lat, long - location.long);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = { lat: location.lat, lng: location.long };
        }
      }
    }
    return nearest;
  }

  async deleteLocation(user: ObjectId, location: ObjectId) {
    return await this.locations.deleteOne({ _id: location, user });
  }

  async getLocations(user: ObjectId) {
    return await this.locations.readMany({ user });
  }
}
