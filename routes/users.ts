import express, { Router } from "express";
import { User } from "../models/User";

export const usersRouter: Router = express.Router();

usersRouter.get('/', (_req, res) => {
    res.send('Users endpoint hit.');
});

usersRouter.get('/getUser/:id', async (req, res) => {
    try {
        await User.sync();
        const resUser = await User.findAll({
            where: {
                user_id: parseInt(req.params.id)
            }
        });
        res.send(resUser);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send('Failure to retrieve user');
    }
})