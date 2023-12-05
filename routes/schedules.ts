import express, { Router } from "express";
import { Schedule } from "../models/Schedule";

export const schedulesRouter: Router = express.Router();

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
        res.send(resSchedule)
    } catch(err) {
        console.log(err);
        res.status(500);
        res.send(err);
    }
})