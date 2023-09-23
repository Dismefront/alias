import { MouseEvent, useEffect, useRef, useState } from 'react';
import styles from './notification.module.css';

export interface NotificationProps {
    text: string
};

export type MouseState = {
    xStarting: number,
    pressed: boolean
}

const absoluteRightPos = 15;
const toBeRemovedOffset = 200;

export const Notification: React.FC<NotificationProps> = ({ text }) => {

    const [mouseState, updateMouseState] = useState<MouseState>({ xStarting: 0, pressed: false });
    const [offset, udpateOffset] = useState<number>(0);
    const [isRemoved, removeNotification] = useState<boolean>(false);

    useEffect(() => {
        const handleMouseUp = () => {
            updateMouseState({ ...mouseState, pressed: false });
            udpateOffset(0);
        }
        addEventListener('mouseup', handleMouseUp);
        return () => {
            removeEventListener('mouseup', handleMouseUp);
        }
    }, []);

    return (<div className={`${styles.notification} ${isRemoved ? styles.remove: ''}`} 
            style={{right: `${offset + 15}px`, opacity: `${1 - Math.abs(offset / toBeRemovedOffset)}`}}> 
        <div className={styles.container} onMouseMove={(event: MouseEvent) => {
            if (!mouseState.pressed)
                return;
            let offs = mouseState.xStarting - event.clientX;
            udpateOffset(offs);
            updateMouseState({ ...mouseState });
            if (Math.abs(offs) >= toBeRemovedOffset)
                removeNotification(true);
        }}
        onMouseDown={(event: MouseEvent) => updateMouseState({ ...mouseState, pressed: true, xStarting: event.clientX })}
        >
            <button 
            className={styles.closeButton} 
            onMouseDown={ (event: MouseEvent) => event.stopPropagation()}
            onClick={ (event: MouseEvent) => {removeNotification(true)} }>
                <dd className={styles.icon}>x</dd>
            </button>
            <dd>{ text }</dd>
        </div>
    </div>)
}