import { ReactElement, useState } from 'react';
import { Notification, NotificationProps } from '../../widgets/notification';
import styles from './banner.module.css';

export interface BannerProps {
    text: string
};

let previousTimeNotificationShowed: Date | undefined = undefined;

export const Banner: React.FC<BannerProps> = ({ text }) => {

    const [notifications, updateNotifications] = useState<ReactElement[]>([]);

    return (<div className={styles.banner}>
        { notifications }
        <div className={styles.description}>your lobby:</div>
        <div className={styles.container} title='copy' onClick={() => {
            navigator.clipboard.writeText(text);
            if (previousTimeNotificationShowed && new Date().getTime() - previousTimeNotificationShowed.getTime() <= 600)
                return;
            previousTimeNotificationShowed = new Date();
            updateNotifications([...notifications, <Notification key={'notification' + notifications.length} 
                text="Room id copied" id={ notifications.length } />])
        }}>
            <dd>{ text }</dd>
        </div>
    </div>)
}