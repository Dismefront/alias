import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';

const port = 3000;
const app: Express = express();
const server: http.Server = http.createServer(app);

import { handleWSS, gameRoute } from './game';

handleWSS(server);
app.use('/game', gameRoute);

server.listen(port, () => {
    console.log(`Server started on port ${port}`)
});