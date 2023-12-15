import express, { Router } from "express";
import { Schedule } from "../models/Schedule";
import bodyParser from "body-parser";

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
        res.status(404).send(err);
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

    // Data validation
    if ( scheduleData.day_of_week == -1  || scheduleData.user_id == -1 || 
           !scheduleData.time_in  || !scheduleData.time_out ) {
        throw new Error('Not all data present! Request failed!');
    }

    try {
        const newScheduleEntry = await Schedule.create(scheduleData);
        res.status(200).send(newScheduleEntry);
    } catch(err) {
        console.log(err);
        res.status(501).send(err);
    }
});