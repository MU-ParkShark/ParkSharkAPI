import express, { Router } from "express";

export const lotActivityRouter : Router = express.Router();

lotActivityRouter.get('/', (_req, res) => {
    res.send('Lot Activtiy endpoint hit.');
});