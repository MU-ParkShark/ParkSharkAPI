import express, { Router } from 'express';
import { Lot_Activity } from '../models/Lot_Activity';

export const lotActivityRouter: Router = express.Router();

/*
	* No need for PUT/DELETE as activity should never
	* need to be changed/deleted from the app.

	* Endpoints:
		* / - GET
			* Tester endpoint
		* /spot/:id - GET
			* Get spot activity by spot id
		* /spot/:id - POST
			* Create new activity for spot id
		* /:id - GET
			* Get activity by activity id
*/

lotActivityRouter.get('/', (_req, res) => {
	res.send('Lot Activity endpoint hit.');
});

lotActivityRouter.get('/spot/:id', async (req, res) => {
	try {
		const activity = await Lot_Activity.findAll({
			where: {
				spot_id: parseInt(req.params.id),
			},
		});

		res.status(200).json(activity);
	} catch (error) {
		console.log(error);
		res.status(200).send('Unable to retrieve lot activity.');
	}
});

lotActivityRouter.post('/spot/:id', async (req, res) => {
	try {
		const activity = await Lot_Activity.create({
			timeslot: req.body.timeslot,
			day_of_week: req.body.day_of_week,
			ptime_in: req.body.ptime_in,
			ptime_out: req.body.ptime_out,
			user_id: req.body.user_id,
			spot_id: req.params.id,
		});

		res.status(200).json(activity);
	} catch (error) {
		console.log(error);
		res.status(200).send('Unable to retrieve lot activity.');
	}
});

lotActivityRouter.get('/:id', async (req, res) => {
	try {
		const activity = await Lot_Activity.findAll({
			where: {
				activity_id: parseInt(req.params.id),
			},
		});

		res.status(200).json(activity);
	} catch (error) {
		console.log(error);
		res.status(200).send('Unable to retrieve lot activity.');
	}
});
