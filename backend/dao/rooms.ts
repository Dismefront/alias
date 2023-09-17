import { WebSocket } from 'ws';

export type roomCreationResult = {
    id: string,
    date_created: Date
};

export interface Player {
    nickname: string | undefined,
    ws: WebSocket
};

export interface RoomProps {
    id: string,
    date_created: Date,
    in_game: Player[],
};

export const rooms = new Map<string, RoomProps>();

async function createRoom(id: string) {
    const newRoom: RoomProps = { id, date_created: new Date(), in_game: [] };
    rooms.set(id, newRoom);
    return newRoom;
}

export default { createRoom };