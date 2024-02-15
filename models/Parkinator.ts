import { Parking_Spot } from "../models/Parking_Spot";
import { Lot_Activity } from "./Lot_Activity";
import { Tag_Activity } from "./Tag_Activity";
import { State } from "../Enums";
import { QueryTypes } from "sequelize";

interface ILocation {
  longitude: number;
  latitude: number;
}

export default class Parkinator {
  constructor() {}

  private static getNearbySpot(
    longitude: number,
    latitude: number,
  ): Promise<number> {
    // TODO: Port Tyler's geoquery code here
    const promise: Promise<number> = new Promise(async (res, rej) => {
      try {
        const query = `SELECT *, ST_Distance_Sphere(latlong, POINT(${longitude}, ${latitude})) as distance FROM parking_spots ORDER BY distance LIMIT 1`;
        const spots: any[] | undefined = await Parking_Spot.sequelize?.query(
          query,
          {
            type: QueryTypes.SELECT, // returns an array
          },
        );

        if (!spots || spots.length === 0) throw new Error("No spots found.");

        res(spots[0].spot_id);
      } catch (e) {
        rej(`ERR: ${e}`);
      }
    });

    return promise;
  }

  private static updateSpot(spot_id: number): Promise<String> {
    // TODO: Update Parking_Spots table isAvailable and Lot_Activity pTimeIn, pTimeOut, timeslot, and day_of_week.
    const lotActivityData = {
      // TODO
    };

    const spotUpdateData = {
      // TODO
    };

    const promise: Promise<String> = new Promise(async (res, rej) => {
      let lotActivitySuccess = false;
      let spotUpdateSuccess = false;

      try {
        const newSpot = await Lot_Activity.create(lotActivityData);
        lotActivitySuccess = true;
      } catch (e) {
        rej(`ERR: ${e}`);
      }

      try {
        const entryToBeChanged = await Parking_Spot.findOne({
          where: {
            spot_id,
          },
        });

        entryToBeChanged?.set(spotUpdateData);
        const response = await entryToBeChanged?.save();
        spotUpdateSuccess = true;
      } catch (e) {
        rej(`ERR: ${e}`);
      }

      if (!(lotActivitySuccess && spotUpdateSuccess))
        rej("Something went wrong updating the spot data!");

      res("Success! Spot status updated and lot activity entry created!");
    });

    return promise;
  }

  public async determineState(
    tag_id: number,
    longitude: number,
    latitude: number,
  ): Promise<State> {
    // TODO: utilize above methods to determine if spot is taken and what state car is in.
    const location: ILocation = { longitude, latitude };

    const promise: Promise<State> = new Promise(async (res, rej) => {
      try {
        const tag_activity = await Tag_Activity.findOne({
          where: {
            tag_id,
          },
          order: [["tag_activity_id", "DESC"]],
        });

        const counter = tag_activity?.getDataValue(
          "unchanged_location_counter",
        );

        if (counter >= 3) {
          const spotID = await Parkinator.getNearbySpot(longitude, latitude);

          await Parkinator.updateSpot(spotID);

          res(State.PARKED);
        } else {
          // TODO: Decode MySQL point to compare with given longitude and latitude.
          const tagLocation = tag_activity?.getDataValue("location");

          if (tagLocation === location)
            tag_activity?.set({ location_unchanged_counter: counter + 1 });

          res(State.UNDECIDED);
        }

        res(State.UNDECIDED);
      } catch (e) {
        rej(`ERR: ${e}`);
      }
    });

    return promise;
  }
}
