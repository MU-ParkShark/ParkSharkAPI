import express, { Router } from "express";
import { Tag_Activity } from "../models/Tag_Activity";
import { QueryTypes } from "sequelize";

export const tagActivityRouter: Router = express.Router();

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
// Query params:
// 	- long, float
// 	- lat, float
tagActivityRouter.put("/:id/location", async (req, res) => {
  const { id } = req.params;
  const { long, lat } = req.query;
  try {
    const tag_activity = await Tag_Activity.findOne({
      where: {
        tag_id: parseInt(id),
      },
    });
    if (!tag_activity) throw new Error("Tag not found.");
    await tag_activity.update({
      location: { type: "Point", coordinates: [long, lat] },
    });
    res.status(200).json(tag_activity);
  } catch (error) {
    console.log(error);
    res.status(500).send("Unable to update tag location.");
  }
});
