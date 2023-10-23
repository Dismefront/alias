import styles from './team.module.css';

export const TeamAdd: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
    return (
        <div className={ styles.AddBtnContainer }>
            <button { ...props } className={ styles.TeamAddButton }>+</button>
        </div>
    );
}