import express, { Router } from "express";
import { Schedule } from "../models/Schedule";
import bodyParser from "body-parser";
import { scheduleSchema } from "../models/JoiSchemas";
import { auth } from "../middleware/jwt-verification";

export const schedulesRouter: Router = express.Router();
const jsonParser = bodyParser.json();

schedulesRouter.get("/", (_req, res) => {
  res.send("Schedules endpoint hit.");
});

schedulesRouter.get("/getUserSchedule/:id", auth, async (req, res) => {
  try {
    const resSchedule = await Schedule.findAll({
      where: {
        user_id: parseInt(req.params.id),
      },
    });
    res.send(resSchedule);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
});

// Expects request body to be JSON data
schedulesRouter.post("/setSchedule", jsonParser, auth, async (req, res) => {
  const scheduleData = {
    user_id: req.body.userId || -1,
    time_in: req.body.timeIn || null,
    day_of_week: req.body.dayOfWeek || -1,
    event_name: req.body.eventName || "",
    lots: req.body.lots || null,
  };

  try {
    await scheduleSchema.validateAsync(scheduleData);
    const newScheduleEntry = await Schedule.create(scheduleData);
    res.status(200).send(newScheduleEntry);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
});

// Expects request body to be JSON data
schedulesRouter.patch(
  "/updateSchedule/:id",
  jsonParser,
  auth,
  async (req, res) => {
    const updatedData = {
      ...req.body,
    };

    try {
      const entryToBeChanged = await Schedule.findOne({
        where: {
          schedule_id: req.params.id,
        },
      });

      if (entryToBeChanged) {
        entryToBeChanged.set(updatedData);
        const response = await entryToBeChanged.save();
        res.status(200).send(response);
      } else {
        res.status(200).send("Schedule entry not found");
      }
    } catch (err) {
      console.log(err);
      res.status(200).send(err);
    }
  },
);

schedulesRouter.delete("/deleteScheduleEntry/:id", auth, async (req, res) => {
  try {
    const entryToBeDeleted = await Schedule.findOne({
      where: {
        schedule_id: req.params.id,
      },
    });

    if (entryToBeDeleted) {
      const response = await entryToBeDeleted.destroy();
      res.status(200).send(response);
    } else {
      res.status(200).send("Schedule entry not found");
    }
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
});
