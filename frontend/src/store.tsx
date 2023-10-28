import { createEvent, createStore } from "effector"
import { PlayerData } from "./apiTypes";

export interface PlayerI {
    nickname: string
};

export interface NotificationI {
    ids: number[]
}

export const setData = createEvent<PlayerI>();
export const updatePlayers = createEvent<PlayerData>();

export const notificationAdd = createEvent<number>();
export const notificationDelete = createEvent<NotificationI>();


export const $gameStore = createStore<PlayerI | null>(null)
    .on(setData, (_, payload) => {
        return { nickname: payload.nickname };
    });

export const $playersStore = createStore<PlayerData>({ ownID: -1, players: [] })
    .on(updatePlayers, (_, payload) => {
        return payload;
    })

export const $notificationStore = createStore<NotificationI>({ ids: [] })
    .on(notificationAdd, (prev_data, payload) => {
        if (prev_data.ids.includes(payload))
            return;
        prev_data.ids.push(payload);
        return { ids: [...prev_data.ids] };
    });