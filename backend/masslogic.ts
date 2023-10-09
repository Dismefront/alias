import { Player } from "./dao/rooms";

export const updateRelevantConnections = (arr: Player[]) => {
    const sentData = arr.map((el, index) => (
        { id: index, nickname: el.nickname, teamNO: -1 }
    )).filter(x => !!x.nickname);
    arr.forEach((el, index) => (el.ws.send(JSON.stringify({ 
        type: 'players',
        payload: {
            players: sentData, 
            ownID: index
        }
    }))));
}