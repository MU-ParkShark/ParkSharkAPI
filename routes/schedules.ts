import express, { Router } from "express";
import { Schedule } from "../models/Schedule";
import bodyParser from "body-parser";
import { scheduleSchema } from "../models/JoiSchemas";

export const schedulesRouter: Router = express.Router();

const jsonParser = bodyParser.json();

schedulesRouter.get('/', (_req, res) => {
    res.send('Schedules endpoint hit.');
});

schedulesRouter.get('/getUserSchedule/:id', async (req, res) => {
    try {
        const resSchedule = await Schedule.findAll({
            where: {
                'user_id': parseInt(req.params.id)
            }
        })
        res.send(resSchedule);
    } catch(err) {
        console.log(err);
        res.status(200).send(err);
    }
});

// Expects request body to be JSON data
schedulesRouter.post('/setSchedule', jsonParser, async (req, res) => {
    const scheduleData = {
        user_id: req.body.userId || -1,
        time_in: req.body.timeIn || null,
        time_out: req.body.timeOut || null,
        day_of_week: req.body.dayOfWeek || -1
    };

    try {
        await scheduleSchema.validateAsync(scheduleData);
        const newScheduleEntry = await Schedule.create(scheduleData);
        res.status(200).send(newScheduleEntry);
    } catch(err) {
        console.log(err);
        res.status(200).send(err);
    }
});

// Expects request body to be JSON data
schedulesRouter.patch('/updateSchedule/:id', jsonParser, async (req, res) => {
    const updatedData = {
        ...req.body
    };

    try {
        const entryToBeChanged = await Schedule.findOne({
            where: {
                'schedule_id': req.params.id
            }
        });

        entryToBeChanged?.set(updatedData);

        const response = await entryToBeChanged?.save();
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});

schedulesRouter.delete('/deleteScheduleEntry/:id', async (req, res) => {
    try {
        const entryToBeDeleted = await Schedule.findOne({
            where: {
                'schedule_id': req.params.id
            }
        });

        const response = await entryToBeDeleted?.destroy();
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});