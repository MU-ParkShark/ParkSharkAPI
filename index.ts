import express, { Express, Request, Response } from 'express';

const app : Express = express();

app.get('/', (req : Request, res : Response) => {
  res.send('ParkShark API loading...');
});

app.listen(3000);
