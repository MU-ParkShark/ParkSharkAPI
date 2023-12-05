import express, { Router } from "express";

export const usersRouter: Router = express.Router();

usersRouter.get('/', (_req, res) => {
    res.send('Users endpoint hit.');
});