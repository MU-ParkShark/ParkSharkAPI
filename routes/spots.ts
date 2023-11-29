import express, { Router } from "express";

export const spotsRouter : Router = express.Router();

spotsRouter.get('/', (_req, res) => {
    res.send('Spots endpoint hit.');
});