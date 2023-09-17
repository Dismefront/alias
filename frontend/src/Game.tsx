import { useStore } from "effector-react"
import { $store } from "./store"

export const WSIP = 'ws://localhost:3000/game'; 

export const Game: React.FC = () => {

    const store = useStore($store);

    return (
        <div className="menu">
            <h1>{ store?.lobby }</h1>
        </div>
    )
}