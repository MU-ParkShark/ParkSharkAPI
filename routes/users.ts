import express, { Router } from "express";
import { User, UserAttributes, UserCreationAttributes } from "../models/User";
import { Credential, CredentialAttributes, CredentialCreationAttributes } from '../models/Credential';
import { userSchema } from "../models/JoiSchemas";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";

export const usersRouter: Router = express.Router();

const jsonParser = bodyParser.json();

usersRouter.get('/', (_req, res) => {
    res.send('Users endpoint hit.');
});

usersRouter.get('/getUser/:id', async (req, res) => {
    try {
        await User.sync();

        const resUser = await User.findOne({
            where: {
                user_id: parseInt(req.params.id)
            }
        });

        if (resUser) {
            const user = resUser.get({ plain: true }) as UserAttributes;

            const rCredential = await Credential.findOne({
                where: {
                    user_id: user.user_id
                },
                attributes: ['email']
            });

            const credential = rCredential ? rCredential.get({ plain: true }) as CredentialAttributes : null;

            const userWithEmail = {
                ...resUser.toJSON(),
                email: credential ? credential.email : null
            };

            res.send(userWithEmail);
        } else {
            res.status(200).send('User not found');
        }
    } catch (error) {
        console.log(error);
        res.status(200).send('Failure to retrieve user');
    }
});

usersRouter.post('/createUser', jsonParser, async (req, res) => {
  const requestData = {
    ...req.body
  };

  try {
    await userSchema.validateAsync(requestData);

    // Extract user data
    const userData: UserCreationAttributes = {
      vehicle_make: requestData.vehicle_make,
      vehicle_model: requestData.vehicle_model,
      vehicle_year: requestData.vehicle_year,
      vehicle_color: requestData.vehicle_color,
      license_plate: requestData.license_plate,
      tag_id: requestData.tag_id || null,
      first_name: requestData.first_name,
      last_name: requestData.last_name
    };

    // Create the user record
    const newUser = await User.create(userData);
    const user = newUser.get({ plain: true }) as UserAttributes;

    // Extract credential data
    const credentialData: CredentialCreationAttributes = {
      user_id: user.user_id,
      email: requestData.email,
      password: requestData.password
    };

    // Create the credential record
    const newCredential = await Credential.create(credentialData);

    res.status(200).send({ user, credential: newCredential });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

usersRouter.post('/validateLogin', jsonParser, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the credential based on the provided email
    const credential = await Credential.findOne({ where: { email } });

    if (!credential) {
      return res.status(200).json({ error: 'Unable to find account associated with this email.' });
    }

    const tCredential = credential.get({ plain: true }) as CredentialAttributes;

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, tCredential.password);

    if (!isPasswordValid) {
      return res.status(200).json({ error: 'Invalid email or password' });
    }

    // Password is valid, retrieve the associated user
    const user = await User.findOne({ where: { user_id: tCredential.user_id } });

    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    // Login is valid, send the user details in the response
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(200).json({ error: 'Internal server error' });
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
