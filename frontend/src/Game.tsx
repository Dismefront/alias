import { useStore } from "effector-react"
import { $gameStore } from "./store"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "./index";
import { Banner } from "./components/banner";

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

export interface Player {
    id: number,
    nickname: string,
    teamNO: number
}

export interface JSONMessage {
    type: 'nickname',
    payload: any
}

export const Game: React.FC = () => {

    const store = useStore($gameStore);
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
            console.log(message.data);
            let data: Player[] = JSON.parse(message.data);
            updatePlayers(data.map(x => ({ id: x.id, nickname: x.nickname, teamNO: x.teamNO })))
        }
    });

    return (
        <div className="menu">
                <Banner text={ window.location.pathname.slice(1) } />
                <h2>{ players?.map(x => x.nickname + " ") }</h2>
        </div>
    )
}