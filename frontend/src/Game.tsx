import { useStore } from "effector-react"
import { $store } from "./store"


export const Game: React.FC = () => {

    const store = useStore($store);

    return (
        <div className="menu">
            hello, {store?.nickname}
        </div>
    )
}