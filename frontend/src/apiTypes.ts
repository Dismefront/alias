export interface CreateRoomData {
    room_id: string | undefined
}

export interface Player {
    id: number,
    nickname: string,
    teamNO: number
}

export interface PlayerData {
    ownID: number,
    players: Player[]
}

export interface GetDataPlayersUpdate {
    type: 'players',
    payload: {
        players: Player[],
        ownID: number
    }
}

export interface JSONMessageNickname {
    type: 'nickname',
    payload: {
        nickname: string | undefined
    }
}

export interface Team {
    id: number,
    name: string
}

export interface JSONMessageAlterTeams {
    type: 'alterteams',
    payload: {
        type: 'add',
        team: Team
    } | {
        type: 'delete'
    }
}

export interface JSONMessageAllTeams {
    type: 'allteams',
    payload: {
        id: number,
        name: string,
        inside: string[]
    }[]
}

export interface JSONMessagePlayerSwitchTeam {
    type: 'playerswitchedteam',
    payload: {
        id: number,
        from: number,
        to: number
    }
}

export type MessageInfo = GetDataPlayersUpdate | JSONMessageNickname | JSONMessageAlterTeams
    | JSONMessageAllTeams | JSONMessagePlayerSwitchTeam;