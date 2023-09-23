import express, { Express, NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';

const port = 3000;
const IP = '192.168.0.107';
const app: Express = express();
const server: http.Server = http.createServer(app);

import { handleWSS, gameRoute } from './game';
import { generateID } from './idgen';

import roomsDAO from './dao/rooms';

handleWSS(server);
app.use(cors());
app.use('/game', gameRoute);

// anti-spam bridge
const timestamps = new Map<string, Date>();
app.use('/create', (req: Request, res: Response, next: NextFunction) => {
    const user_ip = req.ip.replace('::ffff:', '');
    const stamp = timestamps.get(user_ip);
    if (stamp !== undefined && new Date().getTime() - stamp.getTime() < 5000) {
        res.locals.error = "Too frequent requests";
        next();
        return;
    }
    timestamps.set(user_ip, new Date());
    next();
});

app.get('/create', async (req: Request, res: Response) => {
    if (res.locals.error) {
        res.status(550).send(res.locals.error);
        return;
    }
    const id = generateID({ 
        sections: 2,
        symbolCnt: 2
    });
    await roomsDAO.createRoom(id);
    res.status(200).json({
        room_id: id
    });
});

server.listen(port, () => {
    console.log(`Server started on http://${IP}:${port}`)
});
