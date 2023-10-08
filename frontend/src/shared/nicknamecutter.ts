export const cutNickname = (nickname: string, width=12) => {
    if (!nickname)
        return 'undefined';
    return nickname.length < width ? nickname : nickname.slice(0, width) + '...';
}