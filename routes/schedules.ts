import express, { Router } from "express";

export const schedulesRouter: Router = express.Router();

schedulesRouter.get('/', (_req, res) => {
    res.send('Schedules endpoint hit.');
});