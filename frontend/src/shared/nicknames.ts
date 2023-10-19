const nickArray = [
    'Loser',
    'Кот',
    'Black',
    'Cringoulique',
    'Your mom',
    'Насвай',
    'Противный',
    'Абдулла'
]

export const getRandNickname = () => {
    return nickArray[Math.floor(Math.random() * nickArray.length)];
}