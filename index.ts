import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/types.js';
import { resolvers } from './graphql/resolvers.js';

import express, { Express, Request, Response } from 'express';

import { usersRouter } from './routes/users.js';
import { lotsRouter } from './routes/lots.js';
import { spotsRouter } from './routes/spots.js';
import { schedulesRouter } from './routes/schedules.js';
import { lotActivityRouter } from './routes/lotActivity.js';
import { tagsRouter } from './routes/tags.js';
import { tagActivityRouter } from './routes/tagActivity.js';

const app: Express = express();

// Router setup - Will be phased out as part of this branch.
app.use('/users', usersRouter);

app.use('/lots', lotsRouter);

app.use('/spots', spotsRouter);

app.use('/schedules', schedulesRouter);

app.use('/lotactivity', lotActivityRouter);

app.use('/tags', tagsRouter);

app.use('/tagActivity', tagActivityRouter);
app.get('/', (_req: Request, res: Response) => {
	res.send('ParkShark API loading...');
});
// End of router setup

// GraphQL Standalone Server Setup - Should be migrating to full rely on this.
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers
});

app.listen(3000);

const { url } = await startStandaloneServer(apolloServer, {
	listen: { port: 4000 },
});

console.log(`Running GraphQL Server at ${url}`);
