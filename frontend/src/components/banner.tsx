import styles from './banner.module.css';

export interface BannerProps {
    text: string
};

export const Banner: React.FC<BannerProps> = ({ text }) => {
    return (<div className={styles.banner}>
        <div className={styles.container} title='copy' onClick={() => {
            navigator.clipboard.writeText(text);
        }}>
            <dd>{ text }</dd>
        </div>
    </div>)
}