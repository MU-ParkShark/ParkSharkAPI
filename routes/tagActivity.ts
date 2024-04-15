import express, { Router } from "express";
import { Tag_Activity } from "../models/Tag_Activity";
import { Lot_Activity } from "../models/Lot_Activity";
import { Parking_Spot } from "../models/Parking_Spot";
import Parkinator from "../models/Parkinator";
import { State } from "../Enums";
import { QueryTypes } from "sequelize";
import bodyParser from "body-parser";
import { auth } from "../middleware/jwt-verification";

export const tagActivityRouter: Router = express.Router();
const jsonParser = bodyParser.json();

// Get tag's last location
tagActivityRouter.get("/:id/location", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const tag_activity = await Tag_Activity.findOne({
      where: {
        tag_id: parseInt(id),
      },
    });
    if (!tag_activity) throw new Error("Tag not found.");
    const lastLocation = await Tag_Activity.sequelize?.query(
      `SELECT ST_AsText(location) FROM tag_activity WHERE tag_id = ${id}`,
      { type: QueryTypes.SELECT },
    );
    res.status(200).json(lastLocation);
  } catch (error) {
    console.log(error);
    res.status(404).send("Tag not found.");
  }
});

// Update tag's last location
// Body params:
// 	- long, float
// 	- lat, float
tagActivityRouter.put("/:id/location", jsonParser, auth, async (req, res) => {
  const { id } = req.params;
  const { message, long, lat, user_id } = req.body;
  const currentTime = new Date();

  // Validate required fields
  if (!message || !long || !lat || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  try {
    let tag_activity = await Tag_Activity.findOne({
      where: { tag_id: parseInt(id) },
    });
    if (!tag_activity) {
      const tagActivityData = {
        tag_id: id,
        location: { type: "Point", coordinates: [lat, long] },
        update_timestamp: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
      };
      tag_activity = await Tag_Activity.create(tagActivityData);
    } else {
      await tag_activity.update({
        location: { type: "Point", coordinates: [lat, long] },
        update_timestamp: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
      });
    }

    const result = await Parkinator.determineState(
      message,
      parseInt(id),
      tag_activity.getDataValue("tag_activity_id"),
      parseInt(user_id),
      parseFloat(long),
      parseFloat(lat),
    );

    if (result.state === State.UNDECIDED) {
      await tag_activity.update({ status: "IN PROGRESS" });
    } else if (result.state === State.PARKED) {
      await tag_activity.update({ status: "PARKED" });
    }

    return res
      .status(200)
      .json({ success: true, state: result.state, spotData: result.spot_data });
  } catch (error) {
    console.error("Error updating tag location:", error);
    return res.status(200).json({ success: false, message: error });
  }
});

tagActivityRouter.post(
  "/unparked/:spot_id",
  jsonParser,
  auth,
  async (req, res) => {
    const { spot_id } = req.params;
    const currentTime = new Date();
    const pTimeOut = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

    try {
      // Update the lot activity table
      await Lot_Activity.update(
        { ptime_out: pTimeOut, status: "VOID" },
        { where: { spot_id: parseInt(spot_id), status: "PARKED" } },
      );

      // Update the parking spot availability
      await Parking_Spot.update(
        { is_available: 1 },
        { where: { spot_id: parseInt(spot_id) } },
      );

      // Update the corresponding tag's tag_activity status
      const lotActivity = await Lot_Activity.findOne({
        where: { spot_id: parseInt(spot_id), status: "VOID" },
        order: [["activity_id", "DESC"]],
      });
      if (lotActivity) {
        const tagActivityId = lotActivity.getDataValue("tag_activity_id");
        await Tag_Activity.update(
          { status: "VOID" },
          { where: { tag_activity_id: tagActivityId } },
        );
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating unparked status:", error);
      return res.status(200).json({ success: false, message: error });
    }
  },
);
