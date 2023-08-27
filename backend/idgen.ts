export interface generateIDProps {
    symbolCnt: number,
    sections: number;
}

const randomLetter = (): string => {
    const firstLetterCharCode = 'a'.charCodeAt(0);
    const symbolNum = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1 // 26
    return String.fromCharCode(firstLetterCharCode + Math.floor(Math.random() * symbolNum));
}

const randomDigit = (): string => {
    const zeroCharCode = '0'.charCodeAt(0);
    return String.fromCharCode(Math.floor(Math.random() * 10) + zeroCharCode);
}

const randomSym = (): string => {
    return Math.random() >= 0.5 ? randomDigit() : randomLetter();
}

export const generateID = ({ symbolCnt, sections }: generateIDProps) => {
    return [...new Array(sections)].map(x => 
        [...new Array(symbolCnt)]
            .map(() => randomSym())
            .join('')).join('-')
}
