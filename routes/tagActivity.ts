import express, { Router } from "express";
import { Tag_Activity } from "../models/Tag_Activity";
import Parkinator from "../models/Parkinator";
import { QueryTypes } from "sequelize";
import bodyParser from "body-parser";

export const tagActivityRouter: Router = express.Router();
const jsonParser = bodyParser.json();

// Get tag's last location
tagActivityRouter.get("/:id/location", async (req, res) => {
  const { id } = req.params;
  try {
    const tag_activity = await Tag_Activity.findOne({
      where: {
        tag_id: parseInt(id),
      },
    });
    if (!tag_activity) throw new Error("Tag not found.");
    const lastLocation = await Tag_Activity.sequelize?.query(
      `SELECT ST_AsText(last_longlat) FROM tags WHERE tag_id = ${id}`,
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
tagActivityRouter.put("/:id/location", jsonParser, async (req, res) => {
    const { id } = req.params;
    const { message, long, lat, user_id } = req.body;
    const currentTime = new Date();

    // Validate required fields
    if (!message || !long || !lat || !user_id) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        let tag_activity = await Tag_Activity.findOne({
            where: {
                tag_id: parseInt(id),
            },
        });

        if (!tag_activity) {
            const tagActivityData = {
                tag_id: id,
                location: { type: "Point", coordinates: [long, lat] },
                update_timestamp: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
            };

            tag_activity = await Tag_Activity.create(tagActivityData);
        } else {
            await tag_activity.update({
                location: { type: "Point", coordinates: [long, lat] },
                update_timestamp: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
            });
        }

        const state = await Parkinator.determineState(
            message,
            parseInt(id),
            tag_activity.getDataValue("tag_activity_id"),
            parseInt(user_id),
            parseFloat(long),
            parseFloat(lat)
        );

        return res.status(200).json({ success: true, state });
    } catch (error) {
        console.error("Error updating tag location:", error);
        return res.status(200).json({ success: false, message: error });
    }
});
