import express, { Router } from "express";
import { spotSchema } from "../models/JoiSchemas";

export const spotsRouter: Router = express.Router();

spotsRouter.get('/', (_req, res) => {
    res.send('Spots endpoint hit.');
});