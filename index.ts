import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { resolvers } from './graphql/resolvers.js';

import express from 'express';

import { usersRouter } from './routes/users.js';
import { lotsRouter } from './routes/lots.js';
import { spotsRouter } from './routes/spots.js';
import { schedulesRouter } from './routes/schedules.js';
import { lotActivityRouter } from './routes/lotActivity.js';
import { tagsRouter } from './routes/tags.js';
import { tagActivityRouter } from './routes/tagActivity.js';

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename) + '/graphql';

// Read schema file
const typeDefs = readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf-8'
);

async function startApolloServer() {
	const app = express();
	const httpServer = http.createServer(app);
  
	// Create Apollo Server
	const server = new ApolloServer({
	  typeDefs,
	  resolvers,
	  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
  
	// Start Apollo Server
	await server.start();
  
	// REST API Routes
	app.use('/users', usersRouter);
	app.use('/lots', lotsRouter);
	app.use('/spots', spotsRouter);
	app.use('/schedules', schedulesRouter);
	app.use('/lotactivity', lotActivityRouter);
	app.use('/tags', tagsRouter);
	app.use('/tagActivity', tagActivityRouter);
  
	// Apply Apollo middleware to Express
	app.use(
	  '/graphql',
	  cors<cors.CorsRequest>(),
	  bodyParser.json(),
	  expressMiddleware(server),
	);
  
	// Health check endpoint
	app.get('/health', (req, res) => {
	  res.status(200).send('Server is running');
	});
  
	const PORT = process.env.PORT || 3000;
	
	// Start the server
	await new Promise<void>((resolve) => {
	  httpServer.listen({ port: PORT }, resolve);
	});
  
	console.log(`🚀 Server ready at http://localhost:${PORT}`);
	console.log(`🚀 GraphQL endpoint at http://localhost:${PORT}/graphql`);
  }
  
  // Start the server
  startApolloServer().catch((err) => {
	console.error('Failed to start server:', err);
  });
