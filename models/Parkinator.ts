import { Parking_Spot } from "../models/Parking_Spot";
import { Lot_Activity } from "./Lot_Activity";
import { Tag_Activity } from "./Tag_Activity";
import { State } from "../Enums";
import { QueryTypes } from "sequelize";

const getNearestSpotId = async (longitude: number, latitude: number): Promise<number> => {
    try {
        const query = `
        SELECT spot_id, ST_Distance_Sphere(latlong, ST_SRID(POINT(${latitude}, ${longitude}), 4326)) as distance
        FROM parking_spots
        ORDER BY distance
        LIMIT 1
        `;

        const spots: any[] | undefined = await Parking_Spot.sequelize?.query(query, {
            type: QueryTypes.SELECT,
        });

        if (!spots || spots.length === 0) {
            throw new Error("No nearby spots found.");
        }

        const spot = spots[0];
        const distanceInMeters = spot.distance;

        if (distanceInMeters <= 2.1336) {
            return spot.spot_id;
        } else {
            console.log("No spots near this location!");
            return -1;
        }
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
    ptime_in: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
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
): Promise<{state: State, spot_id: number | null}> => {
  try {
    const tagActivity = await Tag_Activity.findOne({
      where: { tag_id: tagId },
      order: [["tag_activity_id", "DESC"]],
    });

    if (message === "CHECK") {
      const unchangedLocationCounter = tagActivity?.getDataValue("location_unchanged_counter") || 0;

      if (unchangedLocationCounter >= 3) {
        const spotId = await getNearestSpotId(longitude, latitude);

        if (spotId !== -1) {
            await updateSpotAndCreateLotActivity(spotId, userId, tagActivityId);
            return { state: State.PARKED, spot_id: spotId };
        } else {
            return { state: State.UNDECIDED, spot_id: null };
        }      
      } else {
          const tagLocation = tagActivity?.getDataValue("location");

          if (tagLocation && tagLocation.coordinates) {
              const [storedLatitude, storedLongitude] = tagLocation.coordinates;

              if (storedLongitude.toFixed(8) === longitude.toFixed(8) && storedLatitude.toFixed(8) === latitude.toFixed(8)) {
                  tagActivity?.set({ location_unchanged_counter: unchangedLocationCounter + 1 });
                  await tagActivity?.save();
              } else {
                  tagActivity?.set({ location_unchanged_counter: 0 });
                  await tagActivity?.save();
              }
          }
          return { state: State.UNDECIDED, spot_id: null };
      }
    } else if (message === "DISCONNECT") {
        const spotId = await getNearestSpotId(longitude, latitude);

        if (spotId !== -1) {
            const activityId = tagActivity?.getDataValue("tag_activity_id") || tagActivityId;
            await updateSpotAndCreateLotActivity(spotId, userId, activityId);
            return { state: State.PARKED, spot_id: spotId };
        } else {
            return { state: State.UNDECIDED, spot_id: null };
        }    
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
