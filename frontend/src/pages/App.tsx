import { Dispatch, FunctionComponent, SetStateAction, useEffect, useRef, useState } from "react";
import styles from './app.module.css';

import { API } from "../index";
import { setData } from "../store";
import { CreateRoomData } from "../apiTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { getRandNickname } from "../shared/nicknames";

function applyData(data: string | undefined, errorMsg: string,
        updateErrorMessage: Dispatch<SetStateAction<string | undefined>>): boolean {
    if (!data || data.trim() === "") {
        updateErrorMessage(errorMsg);
        return false;
    }
    updateErrorMessage('');
    return true;
}

async function handleCreate(updateErrorMessage: Dispatch<SetStateAction<string | undefined>>): Promise<string | undefined> {
    const res = await fetch(`${API}/create`, {
        method: 'get'
    });
    if (res.status === 550)
        updateErrorMessage('Too frequent requests. Try again in 5 seconds');
    else if (res.status >= 400)
        updateErrorMessage('An error occured');
    else {
        updateErrorMessage('');
        const data = await res.json() as CreateRoomData;
        if (!applyData(data.room_id, "Could not create lobby", updateErrorMessage))
            return undefined;
        return data.room_id;
    }
    return undefined;
}

export const App: FunctionComponent = () => {

    const inplink = useRef<HTMLInputElement>(null);
    const [inpname, changeInpName] = useState<string>(getRandNickname());
    const [errorMessage, updateErrorMessage] = useState<string>();
    const navigate = useNavigate();
    const location = useLocation();

    let roomErrorMessage = location.state;
    window.history.replaceState('', document.title);

    return (
        <div className='menu'>
            <div className={styles.container}>
                <p className={styles.errormsg}>{ roomErrorMessage }</p>
                <h1>alias</h1>
                <div className={styles.interractive}>
                    <input type="text" 
                        onChange={event => changeInpName(event.target.value)} 
                        value={inpname} 
                        className={styles.textField} 
                        placeholder="nickname"/>
                    <button 
                        className={styles.btn}
                        onClick={async () => {
                            if (!applyData(
                                    inpname, 
                                    'Enter your nickname', 
                                    updateErrorMessage
                                ))
                                return;
                            const room_id = await handleCreate(updateErrorMessage);
                            if (room_id && inpname) {
                                setData({ nickname: inpname });
                                navigate(`/${room_id}`);
                            }
                    }}>New game</button>
                    <button 
                        onClick={() => {
                            if (!inplink.current)
                                return;
                            if (!applyData(
                                    inpname, 
                                    'Enter your nickname', 
                                    updateErrorMessage
                                ))
                                return;
                            const room_id = inplink.current.value;
                            if (inpname) {
                                setData({ nickname: inpname });
                                navigate(`/${room_id}`);
                            }
                        }}
                        className={styles.btn}
                    >Join Game</button>
                    <input ref={inplink} type="text" className={styles.textField} placeholder="room id"/>
                </div>
                <p className={styles.errormsg}>{ errorMessage }</p>
            </div>
        </div>
    );
}