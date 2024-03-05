import express, { Router } from "express";
import { User } from "../models/User";
import { userSchema } from "../models/JoiSchemas";
import bodyParser from "body-parser";

export const usersRouter: Router = express.Router();

const jsonParser = bodyParser.json();

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
        res.status(200).send('Failure to retrieve user');
    }
});

usersRouter.post('/createUser', jsonParser, async (req, res) => {
    const userData = {
        vehicle_make: req.body.vehicle_make || null,
        vehicle_model: req.body.vehicle_model || null,
        vehicle_year: req.body.vehicle_year || -1,
        vehicle_color: req.body.vehicle_color || null,
        license_plate: req.body.license_plate || null,
        tag_id: req.body.tag_id || -1,
        first_name: req.body.first_name || null,
        last_name: req.body.last_name || null
    };

    try {
        await userSchema.validateAsync(userData);
        const newUser = await User.create(userData);
        res.status(200).send(newUser);
    } catch (err) {
        console.error(err);
        res.status(200).send(err);
    }
});

usersRouter.patch('/updateUser/:id', jsonParser, async (req, res) => {
    const updateData = {
        ...req.body
    };

    try {
        const entryToBeChanged = await User.findOne({
            where: {
                'user_id': req.params.id
            }
        });

        entryToBeChanged?.set(updateData);

        const response = await entryToBeChanged?.save();
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});

usersRouter.delete('/deleteUser/:id', jsonParser, async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                'user_id': parseInt(req.params.id)
            }
        });

        const response = await user?.destroy();
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});
