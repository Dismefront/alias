import { createEvent, createStore } from "effector"

export interface PlayerI {
    nickname: string
};

export interface NotificationI {
    ids: number[]
}

export const setData = createEvent<PlayerI>();

export const notificationAdd = createEvent<number>();
export const notificationDelete = createEvent<NotificationI>();


export const $gameStore = createStore<PlayerI | null>(null)
    .on(setData, (_, payload) => {
        return { nickname: payload.nickname };
    });


export const $notificationStore = createStore<NotificationI>({ ids: [] })
    .on(notificationAdd, (prev_data, payload) => {
        if (prev_data.ids.includes(payload))
            return;
        prev_data.ids.push(payload);
        return { ids: [...prev_data.ids] };
    });