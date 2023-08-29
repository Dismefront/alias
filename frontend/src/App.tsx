import { FunctionComponent, useRef, useState } from "react";
import styles from './styles/styles.module.css';

import { API } from "./index";
import { useNavigate } from "react-router-dom";

export const App: FunctionComponent = () => {

    const inplink = useRef<HTMLInputElement>(null);
    const [errorMessage, updateErrorMessage] = useState<string>();
    const navigate = useNavigate();

    return (
        <div className='menu'>
            <div className={styles.container}>
                <button 
                    className={styles.btn}
                    onClick={async () => {
                        const res = await fetch(`${API}/create`, {
                            method: 'get'
                        });
                        if (res.status === 550)
                            updateErrorMessage('Too frequent requests. Try again in 5 seconds');
                        else if (res.status >= 400)
                            updateErrorMessage('An error occured');
                        else {
                            updateErrorMessage('');
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
                <p className={styles.errormsg}>{ errorMessage }</p>
            </div>
        </div>
    );
}