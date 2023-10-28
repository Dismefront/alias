import { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import { Player } from '../../apiTypes';
import { cutNickname } from '../../shared/nicknamecutter';
import { JoinBtn } from './JoinBtn';
import styles from './team.module.css';
import { v4 as uuid4 } from 'uuid';

export enum TeamThemes {
    SPECS='SPECS',
    TEAM='TEAM',
    WONTEAM='WONTEAM',
    LOSTTEAM='LOSTTEAM'
}

export interface TeamProps {
    id: number,
    me?: number,
    name: string,
    members: Player[],
    theme?: TeamThemes,
    websocket: WebSocketHook<unknown, MessageEvent<any> | null>
}

export const Team: React.FC<TeamProps> = (props) => {

    const { theme=TeamThemes.SPECS, websocket } = props;

    return (
        <div className={ `${styles.team} ${styles[theme]}` }>
            <div className={ styles.teamname }>
                <div>{ props.name }</div>
            </div>
            <div className={ styles.members }>
                <ul>

                    { props?.members?.map((x) => {
                        if (x.id === props.me)
                            return (<li className={styles.me} key={ `member-${uuid4()}` }>
                                    { cutNickname(x.nickname) }
                                </li>);
                        return (<li key={ `member-${uuid4()}` }>{ cutNickname(x.nickname) }</li>);
                    })
                    }

                    { !props.members.find(x => x.id === props.me) ?
                    <JoinBtn onClick={() => {
                        websocket.sendJsonMessage({
                            type: 'playerteamswitch',
                            payload: {
                                to: props.id
                            }
                        })
                    }} /> : undefined }

                </ul>
            </div>
        </div>
    )

}