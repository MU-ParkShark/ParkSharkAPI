import { Parking_Spot } from "../models/Parking_Spot";
import { Lot_Activity } from "./Lot_Activity";
import { Tag_Activity } from "./Tag_Activity";
import { State } from "../Enums";
import { QueryTypes } from "sequelize";

interface ILocation {
  longitude: number;
  latitude: number;
}

const getNearestSpotId = async (longitude: number, latitude: number): Promise<number> => {
  try {
    const query = `SELECT *, ST_Distance_Sphere(latlong, POINT(${longitude}, ${latitude})) as distance FROM parking_spots ORDER BY distance LIMIT 1`;
    const spots: any[] | undefined = await Parking_Spot.sequelize?.query(query, {
      type: QueryTypes.SELECT,
    });

    if (!spots || spots.length === 0) {
      throw new Error("No nearby spots found.");
    }

    return spots[0].spot_id;
  } catch (error) {
    throw new Error(`Error getting nearest spot: ${error}`);
  }
};

const updateSpotAndCreateLotActivity = async (
  spotId: number,
  userId: number,
  tagActivityId: number
): Promise<void> => {
  const currentTime = new Date();
  const dayOfWeek = currentTime.getDay();

  const lotActivityData = {
    day_of_week: dayOfWeek,
    ptime_in: currentTime.getTime(),
    user_id: userId,
    spot_id: spotId,
    status: "PARKED",
    tag_activity_id: tagActivityId,
  };

  const spotUpdateData = {
    is_available: 0,
  };

  try {
    await Lot_Activity.create(lotActivityData);
    const spot = await Parking_Spot.findOne({ where: { spot_id: spotId } });
    if (spot) {
      spot.set(spotUpdateData);
      await spot.save();
    } else {
      throw new Error(`Spot with ID ${spotId} not found.`);
    }
  } catch (error) {
    throw new Error(`Error updating spot and creating lot activity: ${error}`);
  }
};

const determineState = async (
  message: "CHECK" | "DISCONNECT",
  tagId: number,
  tagActivityId: number,
  userId: number,
  longitude: number,
  latitude: number
): Promise<State> => {
  const location: ILocation = { longitude, latitude };

  try {
    const tagActivity = await Tag_Activity.findOne({
      where: { tag_id: tagId },
      order: [["tag_activity_id", "DESC"]],
    });

    if (message === "CHECK") {
      const unchangedLocationCounter = tagActivity?.getDataValue("unchanged_location_counter") || 0;

      if (unchangedLocationCounter >= 3) {
        const spotId = await getNearestSpotId(longitude, latitude);
        await updateSpotAndCreateLotActivity(spotId, userId, tagActivityId);
        return State.PARKED;
      } else {
        const tagLocation = tagActivity?.getDataValue("location");
        if (tagLocation === location) {
          tagActivity?.set({ unchanged_location_counter: unchangedLocationCounter + 1 });
        }
        return State.UNDECIDED;
      }
    } else if (message === "DISCONNECT") {
      const spotId = await getNearestSpotId(longitude, latitude);
      const activityId = tagActivity?.getDataValue("tag_activity_id") || tagActivityId;
      await updateSpotAndCreateLotActivity(spotId, userId, activityId);
      return State.PARKED;
    } else {
      throw new Error("Invalid message provided. Possible values: CHECK | DISCONNECT");
    }
  } catch (error) {
    throw new Error(`Error determining state: ${error}`);
  }
};

export default {
  getNearestSpotId,
  updateSpotAndCreateLotActivity,
  determineState,
};
