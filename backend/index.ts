import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';

const port = 3000;
const app: Express = express();
const server: http.Server = http.createServer(app);

import { handleWSS, gameRoute } from './game';
import { generateID } from './idgen';

import roomsDAO from './dao/rooms';

handleWSS(server);
app.use('/game', gameRoute);

app.get('/create', (req: Request, res: Response) => {
    const id = generateID({ 
        sections: 3,
        symbolCnt: 5
    });
    roomsDAO.createRoom(id);
    res.status(200).json({
        room_id: id
    });
});

server.listen(port, () => {
    console.log(`Server started on http://192.168.0.109:${port}`)
});
