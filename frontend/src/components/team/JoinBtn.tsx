import styles from './joinbtn.module.css';

export const JoinBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {

    return <button { ...props } className={styles.joinbtn}>+</button>
}