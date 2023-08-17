import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import express, { Request, Response } from 'express';

export const gameRoute = express.Router();

gameRoute.post('/:gameID', (req: Request, res: Response) => {
    console.log(req.params);
    res.send(200);
});

export function handleWSS(server: http.Server) {

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: WebSocket) => {
        console.log("A user connected");

    });

    server.on('upgrade', (req: Request, socket, head) => {
        if (req.url === '/game') {
            wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
                wss.emit('connection', ws, req);
            });
        }
        else {
            socket.destroy();
        }
    });

}