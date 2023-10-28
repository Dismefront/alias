import { WebSocket } from "ws";
import { Player, Team } from "./dao/rooms";

export const updateRelevantConnections = (players: Player[]) => {
    const sentData = players.map((el, index) => (
        { id: index, nickname: el.nickname, teamNO: 0 }
    )).filter(x => !!x.nickname);
    players.forEach((el, index) => (el.ws.send(JSON.stringify({ 
        type: 'players',
        payload: {
            players: sentData, 
            ownID: index
        }
    }))));
}

export const addTeam = (players: Player[], teams: Team[]) => {
    teams.push({
        name: `Team${teams.length}`,
        inside: []
    })
    players.forEach(el => {
        el.ws.send(JSON.stringify({
            type: 'alterteams',
            payload: {
                type: 'add',
                team: {
                    id: teams.length - 1,
                    name: teams[teams.length - 1].name
                }
            }}
        ));
    });
}

export const sendAllTeams = (ws: WebSocket, teams: Team[]) => {
    ws.send(JSON.stringify({
            type: 'allteams',
            payload: teams.map((x, index) => ({
                id: index,
                name: x.name,
                inside: x.inside.map(y => y.nickname)
            }))
    }));
}