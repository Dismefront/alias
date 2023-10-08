import { useStore } from "effector-react"
import { $gameStore } from "../store"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "../index";
import { Banner } from "../components/banner/banner";
import styles from '../styles/game.module.css';
import { Team } from "../components/team/Team";

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
    players: Player[],
    ownID: number
}

export interface JSONMessage {
    type: 'nickname',
    payload: any
}

const enum Teams {
    SPECTATORS = -1
}

export const Game: React.FC = () => {

    const store = useStore($gameStore);
    const room_id = window.location.pathname;
    const navigate = useNavigate();

    const [ players, updatePlayers ] = useState<PlayerData>();

    useEffect(() => {
        if (!roomRegEx.test(room_id))
            navigate('/', { state: 'The room does not exist' });
        else if (!store?.nickname)
            navigate('/', { state: 'Could not let you with invalid nickname' });
    }, []);

    const websocket = useWebSocket(WSIP + room_id, {
        onError: () => {
            navigate('/', { state: 'The room you provided does not exist' })
        },
        onOpen: () => {
            let message: JSONMessage = {
                type: 'nickname',
                payload: {
                    nickname: store?.nickname
                }
            }
            websocket.sendJsonMessage(message);
        },
        onMessage: (message) => {
            let data: GetDataPlayersUpdate = JSON.parse(message.data);
            updatePlayers({ 
                players: data.players.map(x => ({ id: x.id, nickname: x.nickname, teamNO: x.teamNO })), 
                ownID: data.ownID
            })
        }
    });

    let specs = players?.players?.filter(x => x.teamNO === Teams.SPECTATORS);

    return (
        <div className={ styles.menu }>
                <Banner text={ window.location.pathname.slice(1) } />
                <Team name='Spectators' members={ specs } me={ players?.ownID }/>
        </div>
    )
}