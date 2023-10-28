import { useStore } from "effector-react"
import { $gameStore, $playersStore, setData, updatePlayers } from "../store"
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "../index";
import { Banner } from "../components/banner/banner";
import styles from './game.module.css';
import { Team, TeamThemes } from "../components/team/Team";
import { TeamAdd } from "../components/team/TeamAdd";
import { MessageInfo, Player, PlayerData } from "../apiTypes";
import { handleTeamAdd } from "./gamelogic";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

const enum Teams {
    SPECTATORS = 0
}

export interface TeamState {
    id: number,
    component: {
        id: number,
        websocket: WebSocketHook<unknown, MessageEvent<any> | null>,
        teamname: string,
        members: Player[],
        me?: number,
        theme: TeamThemes
    }
}

export const Game: React.FC = () => {

    const store = useStore($gameStore);
    const room_id = window.location.pathname;
    const navigate = useNavigate();
    const players = useStore($playersStore);

    const navigateCalled = useRef<boolean>(false);

    const [ teams, updateTeams ] = useState<TeamState[]>([]);

    useEffect(() => {
        if (!roomRegEx.test(room_id)) {
            navigate('/', { state: 'The room id contains inappropriate symbols' });
            navigateCalled.current = true;
        }
        else if (!store?.nickname) {
            let pr = prompt('Enter your nickname');
            if (pr && pr.trim()) {
                setData({ nickname: pr });
                return;
            }
            navigate('/', { state: 'Could not let you with invalid nickname' });
            navigateCalled.current = true;
        }
    }, []);

    const websocket = useWebSocket(WSIP + room_id, {
        onError: () => {
            if (!navigateCalled.current) {
                navigate('/', { state: 'The room you provided does not exist' });
            }
        },
        onOpen: () => {
            let message: MessageInfo = {
                type: 'nickname',
                payload: {
                    nickname: store?.nickname
                }
            }
            websocket.sendJsonMessage(message);
        },
        onMessage: (message) => {
            let got: MessageInfo = JSON.parse(message.data);
            switch(got.type) {
                case 'players':
                    let data = got.payload;
                    updatePlayers({ 
                        players: data.players.map(x => ({ id: x.id, nickname: x.nickname, teamNO: x.teamNO })), 
                        ownID: data.ownID
                    });
                    updateTeams(teams.map((x, teamNO) => ({
                        id: x.id,
                        component: {
                            ...x.component,
                            members: data.players.filter(y => y.teamNO === teamNO),
                            me: data.ownID
                        }
                    })));
                    break;
                case 'alterteams':
                    if (got.payload.type === 'add') {
                        handleTeamAdd(websocket, teams, got.payload.team.id, got.payload.team.name, updateTeams, players);
                    }
                    break;
                case 'allteams':
                    got.payload.forEach(x => (
                        handleTeamAdd(websocket, teams, x.id, x.name, updateTeams, players)
                    ));
                    break;
                case 'playerswitchedteam':
                    
                    let id = got.payload.id;
                    const player = players.players.find(x => x.id === id);
                    if (player === undefined) {
                        return;
                    }
                    teams[player.teamNO].component.members = teams[player.teamNO].component.members.filter(x => {
                        return x.id !== player.id
                    })
                    player.teamNO = got.payload.to;
                    teams[player.teamNO].component.members.push(player);
                    updateTeams([ ...teams ]);
                    updatePlayers({ ownID: players.ownID, players: [ ...players.players ] });
                    break;
            }
        }
    });

    return (
        <div className={ styles.menu }>
                <Banner text={ window.location.pathname.slice(1) } />
                <div>
                    { teams.length ? <Team 
                    id={teams[0].component.id}
                    members={teams[0].component.members}
                    name={teams[0].component.teamname}
                    websocket={teams[0].component.websocket}
                    key={teams[0].component.teamname}
                    me={teams[0].component.me}
                    theme={teams[0].component.theme} /> : undefined }
                </div>
                <div className={ styles.availableTeams }>
                    { teams.map((x, index) => index !== 0 ? <Team 
                        id={x.component.id}
                        members={x.component.members}
                        name={x.component.teamname}
                        websocket={x.component.websocket}
                        key={x.component.teamname}
                        me={x.component.me}
                        theme={x.component.theme} /> : undefined) }
                    { teams.length < 8 ? 
                    <TeamAdd onClick={() => {
                        websocket.sendJsonMessage({
                            type: 'alterteams',
                            payload: {
                                type: 'add'
                            }
                        });
                    }}/> : 
                    undefined }
                </div>
        </div>
    )
}