import express, { Router } from 'express';
import { Tag, TagCreationAttributes, TagAttributes } from '../models/Tag.js';
import { User } from '../models/User.js';
import bodyParser from "body-parser";

export const tagsRouter: Router = express.Router();

const jsonParser = bodyParser.json();

tagsRouter.get('/', (_req, res) => {
	res.send('Tags endpoint hit.');
});

// Create tag
// Body params:
// 	- user, int
tagsRouter.post('/', jsonParser, async (req, res) => {
  const { user_id } = req.body;

  try {
    // Create the tag
    const tagData: TagCreationAttributes = {
      user_id,
      serial_code: "TESTESTESTESTESTEST",
    };
    const tTag = await Tag.create(tagData);
    const tag = tTag.get({plain: true}) as TagAttributes;

    // Update the user's tag_id in the users table
    await User.update(
      { tag_id: tag.tag_id },
      { where: { user_id } }
    );

    // Retrieve the updated user
    const updatedUser = await User.findOne({ where: { user_id } });

    res.status(201).json({ tag, user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(200).send('Unable to create tag and update user.');
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
		res.status(200).send('Tag not found.');
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
		res.status(200).send('Tag not found.');
	}
});

// Update tag's user_id
// Query params:
// 	- user, int
tagsRouter.put('/:id', jsonParser, async (req, res) => {
	const { id } = req.params;
	const { user_id } = req.body;
	try {
		const tag = await Tag.findByPk(id);
		if (!tag) throw new Error('Tag not found.');
		await tag.update({ user_id });
        await tag.save();
		res.status(200).json(tag);
	} catch (error) {
		console.log(error);
		res.status(200).send('Unable to update tag.');
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
		res.status(200).send('Unable to delete tag.');
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
		res.status(200).send('Unable to delete tag.');
	}
});
