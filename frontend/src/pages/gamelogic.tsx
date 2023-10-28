import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { Player, PlayerData } from "../apiTypes";
import { Team, TeamThemes } from "../components/team/Team";
import { TeamState } from "./Game";

export const handleTeamAdd = (
            websocket: WebSocketHook<unknown, MessageEvent<any> | null>,
            teams: TeamState[] | undefined, teamid: number,
            teamname: string,
            updateTeams: React.Dispatch<React.SetStateAction<TeamState[]>>, 
            players: PlayerData) => {

    if (teams === undefined || (teams.length && teams.length >= 8)) {
        return;
    }
    
    updateTeams(prev => [
        ...prev,
        { 
            id: teamid,
            component: {
                id: teamid,
                websocket: websocket,
                teamname: teamname,
                members: players.players.filter(x => x.teamNO === teamid),
                me: players?.ownID, 
                theme: teamid === 0 ? TeamThemes.SPECS : TeamThemes.TEAM
            },
        }
    ]);

}