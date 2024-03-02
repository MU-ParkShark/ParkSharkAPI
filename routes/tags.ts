import express, { Router } from 'express';
import { Tag } from '../models/Tag';

import { QueryTypes } from 'sequelize';


export const tagsRouter: Router = express.Router();

tagsRouter.get('/', (_req, res) => {
	res.send('Tags endpoint hit.');
});

// Create tag
// Query params:
// 	- user, int
// TODO: Set tag_id to autoincrement in db (requires fk deletion)
tagsRouter.post('/', async (req, res) => {
	const { user } = req.query;
	try {
		const tag = await Tag.create({ user_id: user });
		res.status(201).json(tag);
	} catch (error) {
		console.log(error);
		res.status(500).send('Unable to create tag.');
	}
});

// Get tag by tag_id
tagsRouter.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		res.status(200).json(tag);
	} catch (error) {
		console.log(error);
		res.status(404).send('Tag not found.');
	}
});

// Get tag by user_id
tagsRouter.get('/user/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const tag = await Tag.findAll({ where: { user_id: id } });
		if (!tag) throw new Error('Tag not found.');
		res.status(200).json(tag);
	} catch (error) {
		console.log(error);
		res.status(404).send('Tag not found.');
	}
});

// Update tag's user_id
// Query params:
// 	- user, int
tagsRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { user } = req.query;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		await tag.update({ user_id: user });
		res.status(200).json(tag);
	} catch (error) {
		console.log(error);
		res.status(500).send('Unable to update tag.');
	}
});

// Get tag's last location
tagsRouter.get('/:id/location', async (req, res) => {
	const { id } = req.params;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		const lastLocation = await Tag.sequelize?.query(
			`SELECT ST_AsText(last_latlong) FROM tags WHERE tag_id = ${id}`,
			{ type: QueryTypes.SELECT }
		);
		res.status(200).json(lastLocation);
	} catch (error) {
		console.log(error);
		res.status(404).send('Tag not found.');
	}
});

// Update tag's last location
// Query params:
// 	- long, float
// 	- lat, float
tagsRouter.put('/:id/location', async (req, res) => {
	const { id } = req.params;
	const { long, lat } = req.query;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		await tag.update({
			last_latlong: { type: 'Point', coordinates: [long, lat] },
		});
		res.status(200).json(tag);
	} catch (error) {
		console.log(error);
		res.status(500).send('Unable to update tag location.');
	}
});

// Delete tag by tag_id
tagsRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		await tag.destroy();
		res.status(200).send('Tag deleted.');
	} catch (error) {
		console.log(error);
		res.status(500).send('Unable to delete tag.');
	}
});

// Delete tag by user_id
tagsRouter.delete('/user/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const tag = await Tag.findOne({ where: { user_id: id } });
		if (!tag) throw new Error('Tag not found.');
		await tag.destroy();
		res.status(200).send('Tag deleted.');
	} catch (error) {
		console.log(error);
		res.status(500).send('Unable to delete tag.');
	}
});
