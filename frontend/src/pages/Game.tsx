import { useStore } from "effector-react"
import { $gameStore, setData } from "../store"
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "../index";
import { Banner } from "../components/banner/banner";
import styles from './game.module.css';
import { Team } from "../components/team/Team";
import { TeamAdd } from "../components/team/TeamAdd";
import { MessageInfo, PlayerData } from "../apiTypes";
import { handleTeamAdd } from "./gamelogic";

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

const enum Teams {
    SPECTATORS = -1
}

export interface TeamState {
    id: number,
    component: ReactNode
}

export const Game: React.FC = () => {

    const store = useStore($gameStore);
    const room_id = window.location.pathname;
    const navigate = useNavigate();

    const [ players, updatePlayers ] = useState<PlayerData>();
    const [ teams, updateTeams ] = useState<TeamState[]>([]);
    const navigateCalled = useRef<boolean>(false);

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
                    })
                    break;
                case 'alterteams':
                    if (got.payload.type === 'add') {
                        handleTeamAdd(teams, got.payload.team.id, got.payload.team.name, updateTeams, players);
                    }
                    break;
                case 'allteams':
                    for (let i = 0; i < got.payload.length; i++) {
                        let ok = false;
                        for (let j = 0; j < teams.length; j++) {
                            if (got.payload[i].id === teams[j].id)
                                ok = true;
                        }
                        if (ok)
                            continue;
                        handleTeamAdd(teams, got.payload[i].id, got.payload[i].name, updateTeams, players);
                    }
            }
        }
    });

    let specs = players?.players?.filter(x => x.teamNO === Teams.SPECTATORS);

    return (
        <div className={ styles.menu }>
                <Banner text={ window.location.pathname.slice(1) } />
                <div>
                    <Team name='Spectators' members={ specs || [] } me={ players?.ownID }/>
                </div>
                <div className={ styles.availableTeams }>
                    { teams.map(x => x.component) }
                    { teams.length < 8 ? 
                    <TeamAdd onClick={() => {
                        const jsonMsg = {
                            type: 'alterteams',
                            payload: {
                                type: 'add'
                            }
                        }
                        websocket.sendJsonMessage(jsonMsg);
                    }}/> : 
                    undefined }
                </div>
        </div>
    )
}