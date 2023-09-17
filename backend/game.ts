import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import express, { Request, Response } from 'express';
import { rooms } from './dao/rooms';

export const gameRoute = express.Router();

export interface JSONMessage {
    type: 'nickname',
    payload: any
}

export function handleWSS(server: http.Server) {

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws: WebSocket, req: Request) => {
        const room_id = req.url.slice(1);
        console.log(`A user connected to ${room_id}: ${req.socket.remoteAddress}`);
        const room = rooms.get(room_id);
        if (!room)
            return;
        room.in_game.push({ ws: ws, nickname: undefined });

        ws.on('close', () => {
            console.log(`A user disconnected from ${room_id}: ${req.socket.remoteAddress}`);
            room.in_game = room.in_game.filter(x => x.ws === ws);
        });

        ws.on('message', (message) => {
            const data: JSONMessage = JSON.parse(message.toString());
            switch (data.type) {
                case 'nickname':
                    room.in_game = room.in_game.map((x) => {
                        if (x.ws === ws)
                            x.nickname = data.payload.nickname;
                        return x;
                    });
                    room.in_game.forEach(x => x.ws.send(JSON.stringify(room.in_game.map(x => x.nickname))))
                    break; 
            }
        })
    });

    server.on('upgrade', (req: Request, socket, head) => {
        const regex: RegExp = /^\/[\d+\w+-]+\/*$/i;
        const match = req.url.match(regex);
        if (match) {
            const room_id = match[0].slice(1);
            console.log("\tEstablishing connection on: " + room_id);
            if (!rooms.has(room_id)) {
                console.log('\t\tConnection failed. No room exists');
                socket.destroy();
                return;
            }
            wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
                wss.emit('connection', ws, req);
            });
        }
        else {
            console.log('\t\tConnection failed. Invalid room id');
            socket.destroy();
        }
    });

}