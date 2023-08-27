import { FunctionComponent, useRef } from "react";
import styles from './styles/styles.module.css';

export const App: FunctionComponent = () => {

    const inptext = useRef<HTMLInputElement>(null);

    return (
        <div className={styles.menu}>
            <div className={styles.container}>
                <button className={styles.btn}>New game</button>
                <button 
                    onClick={() => {
                        if (!inptext.current)
                            return;
                        console.log(inptext.current.value);
                    }} 
                    className={styles.btn}
                >Join Game</button>
                <input ref={inptext} type="text" className={styles.textField} placeholder="room id"/>
            </div>
        </div>
    );
}