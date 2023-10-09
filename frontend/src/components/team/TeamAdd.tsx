import styles from './team.module.css';

export const TeamAdd: React.FC = () => {
    return (
        <div className={ styles.AddBtnContainer }>
            <button className={ styles.TeamAddButton }>+</button>
        </div>
    );
}