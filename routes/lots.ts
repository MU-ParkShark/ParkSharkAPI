import express, { Router } from "express";

export const lotsRouter: Router = express.Router();

lotsRouter.get('/', (_req, res) => {
    res.send('Lots endpoint hit.');
});