import express, { Express, Request, Response } from 'express';
import { usersRouter } from './routes/users';
import { lotsRouter } from './routes/lots';
import { spotsRouter } from './routes/spots';
import { schedulesRouter } from './routes/schedules';
import { lotActivityRouter } from './routes/lotActivity';
import { tagsRouter } from './routes/tags';

const app: Express = express();

// Router setup
app.use('/users', usersRouter);

app.use('/lots', lotsRouter);

app.use('/spots', spotsRouter);

app.use('/schedules', schedulesRouter);

app.use('/lotactivity', lotActivityRouter);

app.use('/tags', tagsRouter);

app.get('/', (_req: Request, res: Response) => {
	res.send('ParkShark API loading...');
});

app.listen(3000);
