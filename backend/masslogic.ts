import { Player } from "./dao/rooms";

export const updateRelevantConnections = (arr: Player[]) => {
    const sentData = arr.map((el, index) => (
        { id: index, nickname: el.nickname, teamNO: 1 }
    ));
    arr.forEach(x => x.ws.send(JSON.stringify(sentData)));
}