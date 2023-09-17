import { createEvent, createStore } from "effector"

export interface Player {
    nickname: string,
    lobby: string
};

export const setData = createEvent<Player>();
export const clearData = createEvent();

export const $store = createStore<Player | null>(null)
    .on(setData, (_, payload) => {
        return { nickname: payload.nickname, lobby: payload.lobby };
    });

