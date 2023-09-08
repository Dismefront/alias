import { createEvent, createStore } from "effector"

export interface Player {
    nickname: string,
    lobby: string
};

export const setNickname = createEvent<string>();
export const setLobby = createEvent();
export const clearData = createEvent();

export const $store = createStore<Player | null>(null)
    .on(setNickname, (state, payload) => {
        if (state === null)
            return { nickname: payload, lobby: '' };
        return { ...state, nickname: payload };
    });

