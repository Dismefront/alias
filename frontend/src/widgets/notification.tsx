import { MouseEvent, useEffect, useRef, useState } from 'react';
import styles from './notification.module.css';
import { useStore } from 'effector-react';
import { $notificationStore, notificationAdd } from '../store';

export interface NotificationProps {
    id: number,
    text: string
};

export type MouseState = {
    xStarting: number,
    pressed: boolean
}

const enum NotificationState {
    POPINGUP,
    REMOVING,
    REMOVED
}

const absoluteRightPos = 15;
const toBeRemovedOffset = 200;

export const Notification: React.FC<NotificationProps> = ({ text, id }) => {

    const [mouseState, updateMouseState] = useState<MouseState>({ xStarting: 0, pressed: false });
    const [offset, udpateOffset] = useState<number>(0);
    const [nState, updateNState] = useState<NotificationState>(NotificationState.POPINGUP);
    const nStateRef = useRef(nState);
    nStateRef.current = nState;
    const notificationStore = useStore($notificationStore);

    useEffect(() => {
        notificationAdd(id);

        setTimeout(() => {
            if (nStateRef.current !== NotificationState.REMOVED)
                updateNState(NotificationState.REMOVING);
        }, 3000);

        const handleMouseUp = () => {
            updateMouseState({ ...mouseState, pressed: false });
            udpateOffset(0);
        }
        addEventListener('mouseup', handleMouseUp);
        return () => {
            removeEventListener('mouseup', handleMouseUp);
        }

    }, []);

    return (<div className={`${styles.notification} ${nState === NotificationState.REMOVED ? styles.remove : ''}
                ${nState === NotificationState.REMOVING ? styles.popout : ''} `} 
            style={{right: `${offset + absoluteRightPos}px`, opacity: `${1 - Math.abs(offset / toBeRemovedOffset)}`,
                    top: `${(notificationStore.ids.length - notificationStore.ids.indexOf(id)) * 65 - 50}px`}}
            onAnimationStart={(event: React.AnimationEvent<HTMLDivElement>) => {
                if (event.animationName === styles.popout && nState === NotificationState.REMOVED) {
                    event.preventDefault();
                }
            }}
            onAnimationEnd={(event: React.AnimationEvent<HTMLDivElement>) => {
                if (event.animationName !== styles.popout)
                    return;
                updateNState(NotificationState.REMOVED);
            }}>
        <div className={styles.container} onMouseMove={(event: MouseEvent) => {
            if (!mouseState.pressed)
                return;
            let offs = mouseState.xStarting - event.clientX;
            udpateOffset(offs);
            console.log(offs)
            if (Math.abs(offs) >= toBeRemovedOffset) {
                updateNState(NotificationState.REMOVED);
            }
        }}
        onMouseDown={(event: MouseEvent) => updateMouseState({ ...mouseState, pressed: true, xStarting: event.clientX })}
        >
            <button 
            className={styles.closeButton} 
            onMouseDown={ (event: MouseEvent) => event.stopPropagation()}
            onClick={ (event: MouseEvent) => {updateNState(NotificationState.REMOVED)} }>
                <dd className={styles.icon}>x</dd>
            </button>
            <dd>{ text }</dd>
        </div>
    </div>)
}