import { useStore } from "effector-react"
import { $store } from "./store"
import { useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import useWebSocket from "react-use-websocket";
import { WSIP } from "./index";

const roomRegEx = /^\/[\d+\w+-]+\/*$/i;

export const Game: React.FC = () => {

    const store = useStore($store);
    const room_id = window.location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if (!roomRegEx.test(room_id))
            navigate('/', { state: 'The room does not exist' });
        else if (!store?.nickname)
            navigate('/', { state: 'Could not let you with invalid nickname' });
    }, []);

    const websocket = useWebSocket(WSIP + room_id, {
        onOpen: (event) => {
            
        }
    });

    return (
        <div className="menu">
            <h1>{ window.location.pathname }</h1>
        </div>
    )
}