import { Player, RoomProps, Team } from "./dao/rooms";

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

export const sendAllTeams = (players: Player[], teams: Team[]) => {
    players.forEach(el => {
        el.ws.send(JSON.stringify({
            type: 'allteams',
            payload: teams.map((x, index) => ({
                id: index,
                name: x.name,
                inside: x.inside.map(y => y.nickname)
            }))
        }))
    })
}