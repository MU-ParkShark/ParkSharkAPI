import express, { Express, Request, Response } from 'express';
import { usersRouter } from './routes/users';
import { lotsRouter } from './routes/lots';
import { spotsRouter } from './routes/spots';
import { schedulesRouter } from './routes/schedules';

const app : Express = express();

app.use('/users', usersRouter);

app.use('/lots', lotsRouter);

app.use('/spots', spotsRouter);

app.use('schedules', schedulesRouter);

app.get('/', (_req : Request, res : Response) => {
  res.send('ParkShark API loading...');
});

app.listen(3000);
