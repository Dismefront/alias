import { Player } from '../../pages/Game';
import { cutNickname } from '../../shared/nicknamecutter';
import styles from './team.module.css';
import { v4 as uuid4 } from 'uuid';

export enum TeamThemes {
    SPECS='SPECS',
    TEAM='TEAM',
    WONTEAM='WONTEAM',
    LOSTTEAM='LOSTTEAM'
}

export interface TeamProps {
    me?: number,
    name: string,
    members: Player[] | undefined,
    theme?: TeamThemes
}

export const Team: React.FC<TeamProps> = (props) => {

    const { theme=TeamThemes.SPECS } = props;

    return (
        <div className={ `${styles.team} ${styles[theme]}` }>
            <div className={ styles.teamname }>
                <div>{ props.name }</div>
            </div>
            <div className={ styles.members }>
                <ul>
                    { props?.members?.map((x) => {
                        if (x.id === props.me)
                            return (<li id={styles.me} key={ `member-${uuid4()}` }>
                                    { cutNickname(x.nickname) }
                                </li>);
                        return (<li key={ `member-${uuid4()}` }>{ cutNickname(x.nickname) }</li>);
                    })
                    }
                </ul>
            </div>
        </div>
    )

}