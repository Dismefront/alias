import { Player, PlayerData } from "../apiTypes";
import { Team, TeamThemes } from "../components/team/Team";
import { TeamState } from "./Game";

export const handleTeamAdd = (teams: TeamState[] | undefined, teamid: number,
            teamname: string,
            updateTeams: React.Dispatch<React.SetStateAction<TeamState[]>>, 
            players: PlayerData | undefined) => {

    if (teams === undefined || (teams.length && teams.length >= 8)) {
        return;
    }
    
    updateTeams((prev) => [
        ...prev,
        { 
            id: teamid,
            component: <Team key={ teamname } name={ teamname }
                members={ [] }
                me={ players?.ownID } 
                theme={ TeamThemes.TEAM }/>,
        }
    ] );

}