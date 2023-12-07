import { unsubscribe } from "diagnostics_channel"

type Hand = {
    rawHand: string
    cardsAsValues: number[]
    type: number
    bid: number
}

const namedCardsToValue = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
}

function stringToHand(rawString: string): Hand {
    
    const [rawHand, rawBet] = rawString.split(' ')
    const bet = +rawBet

    const cardsAsValues = rawHand.split('').map(c => {
        return +(namedCardsToValue[c] ?? c)
    })
    const countMap: { [key: number]: number } = {};
    cardsAsValues.forEach(num => {
        countMap[num] = (countMap[num] || 0) + 1;
    });
    const uniqueCount = Object.keys(countMap).length
    const maxCount = Object.values(countMap).reduce((a, b) => {
        return a > b ? a : b
    }, 0);
    let type = 0
    switch (uniqueCount) {
        case 5: 
            type = 0
            break
        case 4:
            type = 1
            break
        case 3:
            type = maxCount
            break
        case 2:
            type = maxCount + 1
            break
        case 1:
            type = 6
            break
    }

    return {
        rawHand,
        cardsAsValues,
        type,
        bid: bet,
    }
}

function compareHands(a: Hand, b: Hand): number {

    if (a.type !== b.type) {
        return a.type - b.type
    }

    for (let i = 0; i < a.cardsAsValues.length; i++) {
        const diff = a.cardsAsValues[i] - b.cardsAsValues[i]
        if (diff !== 0) {
            return diff
        }
    }

    return 0
}

export function solve1(input: string): number {
    const sortedHands = input.split("\n")
        .map(stringToHand)
        .sort(compareHands)

    
    let result = 0
    for (let i = 1; i < sortedHands.length + 1; i++) {
        const hand = sortedHands[i-1]
        
        result += hand.bid * i
    }

    return result
}

const namedCardsToValueT2 = {
    A: 14,
    K: 13,
    Q: 12,
    J: 1,
    T: 10,
}

function stringToHandT2(rawString: string): Hand {
    
    const [rawHand, rawBet] = rawString.split(' ')
    const bet = +rawBet

    const cardsAsValues = rawHand.split('').map(c => {
        return +(namedCardsToValueT2[c] ?? c)
    })
    const countMap: { [key: number]: number } = {};
    let jokersCount = 0
    cardsAsValues.forEach(num => {
        if (num == 1) {
            jokersCount++
            return
        } 
        countMap[num] = (countMap[num] || 0) + 1;
    });
    let uniqueCount = Object.keys(countMap).length
    let maxCount = Object.values(countMap).reduce((a, b) => {
        return a > b ? a : b
    }, 0);
 
    if (jokersCount < 5) {
        maxCount += jokersCount
    } else {
        uniqueCount = 1
        maxCount = 5
    }
    let type = 0
    switch (uniqueCount) {
        case 5: 
            type = 0
            break
        case 4:
            type = 1
            break
        case 3:
            type = maxCount
            break
        case 2:
            type = maxCount + 1
            break
        case 1:
            type = 6
            break
    }

    return {
        rawHand,
        cardsAsValues,
        type,
        bid: bet,
    }
}

function compareHandsT2(a: Hand, b: Hand): number {

    if (a.type !== b.type) {
        return a.type - b.type
    }

    for (let i = 0; i < a.cardsAsValues.length; i++) {
        const diff = a.cardsAsValues[i] - b.cardsAsValues[i]
        if (diff !== 0) {
            return diff
        }
    }

    return 0
}


export function solve2(input: string): number {
    
        const sortedHands = input.split("\n")
        .map(stringToHandT2)
        .sort(compareHandsT2)

    
    let result = 0
    for (let i = 1; i < sortedHands.length + 1; i++) {
        const hand = sortedHands[i-1]
        
        result += hand.bid * i
    }

    return result
}