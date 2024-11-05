import express, { Router } from 'express';
import { Parking_Spot } from '../models/Parking_Spot.js';
import { QueryTypes } from 'sequelize';
import bodyParser from 'body-parser';

export const spotsRouter: Router = express.Router();
const jsonParser = bodyParser.json();

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
spotsRouter.post('/find', jsonParser, async (req, res) => {
	console.log(req.body);
	const { longitude, latitude } = req.body;
	try {
		const query = `SELECT *, ST_Distance_Sphere(latlong, POINT(${latitude}, ${longitude})) as distance FROM parking_spots ORDER BY distance LIMIT 1`;
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
