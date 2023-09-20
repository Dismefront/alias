import styles from './notification.module.css';

export interface NotificationProps {
    text: string
};

export const Notification: React.FC<NotificationProps> = ({ text }) => {
    return (<div className={styles.notification}>
        <div className={styles.container}>
            <button className={styles.closeButton}><dd className={styles.icon}>x</dd></button>
            <dd>{ text }</dd>
        </div>
    </div>)
}