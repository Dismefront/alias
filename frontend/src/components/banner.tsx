import { ReactElement, useState } from 'react';
import { Notification, NotificationProps } from '../widgets/notification';
import styles from './banner.module.css';

export interface BannerProps {
    text: string
};

export const Banner: React.FC<BannerProps> = ({ text }) => {

    const [notifications, updateNotifications] = useState<ReactElement[]>([]);

    return (<div className={styles.banner}>
        <button onClick={() => {
            updateNotifications([...notifications, <Notification key={'notification' + notifications.length} 
                text="This is a simple notification" id={ notifications.length } />])
        }}>add</button>
        { notifications }
        <text className={styles.description}>your lobby:</text>
        <div className={styles.container} title='copy' onClick={() => {
            navigator.clipboard.writeText(text);
        }}>
            <dd>{ text }</dd>
        </div>
    </div>)
}