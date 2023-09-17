import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import express, { Request, Response } from 'express';

export const gameRoute = express.Router();

export function handleWSS(server: http.Server) {

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: WebSocket, req: Request) => {
        console.log("A user connected: " + req.socket.remoteAddress);
    });

    server.on('upgrade', (req: Request, socket, head) => {
        const regex: RegExp = /^\/[\d+\w+-]+\/*$/i;
        const match = req.url.match(regex);
        if (match) {
            const room_id = match[0].slice(1);
            console.log("\tEstablishing connection on: " + room_id);
            wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
                wss.emit('connection', ws, req);
            });
        }
        else {
            socket.destroy();
        }
    });

}