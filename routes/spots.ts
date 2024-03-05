import express, { Router } from 'express';
import { Parking_Spot } from '../models/Parking_Spot';
import { QueryTypes } from 'sequelize';
import { spotSchema } from "../models/JoiSchemas";

export const spotsRouter: Router = express.Router();

spotsRouter.get('/', (_req, res) => {
	res.send('Spots endpoint hit.');
});

spotsRouter.get('/allSpots', async (_req, res) => {
    try {
        const spots = await Parking_Spot.findAll();

        res.status(200).send(spots);
    } catch (e) {
        console.log(e);
        res.status(200).send(e);
    }
});

// TODO: Create spatial index on table to improve performance.
spotsRouter.post('/find', async (req, res) => {
	const { longitude, latitude } = req.query;
	try {
		const query = `SELECT *, ST_Distance_Sphere(latlong, POINT(${longitude}, ${latitude})) as distance FROM parking_spots ORDER BY distance LIMIT 1`;
		const spots = await Parking_Spot.sequelize?.query(query, {
			type: QueryTypes.SELECT,
		});
		if (!spots || spots.length === 0) throw new Error('No spots found.');
		res.status(200).json(spots[0]);
	} catch (error) {
		console.log(error);
		res.status(200).send('Unable to retrieve parking spot.');
	}
});
