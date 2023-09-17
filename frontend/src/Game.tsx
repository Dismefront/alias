import { useStore } from "effector-react"
import { $store } from "./store"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "./index";
import styles from './styles/game.module.css';

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

export interface Player {
    nickname: string,
    teamNO: number
}

export interface JSONMessage {
    type: 'nickname',
    payload: any
}

export const Game: React.FC = () => {

    const store = useStore($store);
    const room_id = window.location.pathname;
    const navigate = useNavigate();

    const [ players, updatePlayers ] = useState<Player[]>();

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
            let data: string[] = JSON.parse(message.data);
            updatePlayers(data.map(x => ({ nickname: x, teamNO: 1 })))
        }
    });

    return (
        <div className="menu">
            <div className={styles.tmp}>
                <h1>{ window.location.pathname }</h1>
                <h2>{ players?.map(x => x.nickname + " ") }</h2>
            </div>
        </div>
    )
}