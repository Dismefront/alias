import { Dispatch, FunctionComponent, SetStateAction, useRef, useState } from "react";
import styles from './styles/styles.module.css';

import { API } from "./index";
import { useNavigate } from "react-router-dom";
import { $store, setNickname } from "./store";
import { useStore } from "effector-react";

function applyNickname(name: string | undefined, 
        updateErrorMessage: Dispatch<SetStateAction<string | undefined>>): boolean {
    if (!name || name.trim() === "") {
        updateErrorMessage('Please, enter your nickname');
        return false;
    }
    updateErrorMessage('');
    setNickname(name);
    return true;
}

async function handleCreate(updateErrorMessage: Dispatch<SetStateAction<string | undefined>>): Promise<boolean> {
    const res = await fetch(`${API}/create`, {
        method: 'get'
    });
    if (res.status === 550)
        updateErrorMessage('Too frequent requests. Try again in 5 seconds');
    else if (res.status >= 400)
        updateErrorMessage('An error occured');
    else {
        updateErrorMessage('');
        return true;
    }
    return false;
}

export const App: FunctionComponent = () => {

    const inplink = useRef<HTMLInputElement>(null);
    const inpname = useRef<HTMLInputElement>(null);
    const [errorMessage, updateErrorMessage] = useState<string>();
    const navigate = useNavigate();
    const store = useStore($store);

    return (
        <div className='menu'>
            <div className={styles.container}>
                <h1>alias</h1>
                <div className={styles.interractive}>
                    <input type="text" ref={inpname} className={styles.textField} placeholder="nickname"/>
                    <button 
                        className={styles.btn}
                        onClick={async () => {
                            if (!applyNickname(inpname?.current?.value, updateErrorMessage))
                                return;
                            if (await handleCreate(updateErrorMessage)) {
                                navigate('/game');
                            }
                    }}>New game</button>
                    <button 
                        onClick={() => {
                            if (!inplink.current)
                                return;
                            console.log(inplink.current.value);
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