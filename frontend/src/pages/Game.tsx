import { useStore } from "effector-react"
import { $gameStore, setData } from "../store"
import { useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "../index";
import { Banner } from "../components/banner/banner";
import styles from './game.module.css';
import { Team, TeamThemes } from "../components/team/Team";
import { TeamAdd } from "../components/team/TeamAdd";

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

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

export interface GetDataShit {
    type: 'shit',
    data: string
}

export interface JSONMessageNickname {
    type: 'nickname',
    payload: {
        nickname: string | undefined
    }
}

export type MessageInfo = GetDataPlayersUpdate | JSONMessageNickname;

const enum Teams {
    SPECTATORS = -1
}

export const Game: React.FC = () => {

    const store = useStore($gameStore);
    const room_id = window.location.pathname;
    const navigate = useNavigate();

    const [ players, updatePlayers ] = useState<PlayerData>();
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
            console.log(navigateCalled.current);
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
            }
        }
    });

    let specs = players?.players?.filter(x => x.teamNO === Teams.SPECTATORS);

    return (
        <div className={ styles.menu }>
                <Banner text={ window.location.pathname.slice(1) } />
                <div>
                    <Team name='Spectators' members={ specs } me={ players?.ownID }/>
                </div>
                <div className={ styles.availableTeams }>
                    <Team name='skuf team' 
                        members={ specs } 
                        me={ players?.ownID } 
                        theme={ TeamThemes.TEAM }/>
                    <Team name='skuf team2' 
                        members={ specs } 
                        me={ players?.ownID } 
                        theme={ TeamThemes.TEAM }/>
                    <TeamAdd />
                </div>
        </div>
    )
}