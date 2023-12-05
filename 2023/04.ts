
class Game {
    id: number
    winningNumbers: number[]
    ownedNumbers: number[]
    ownedNumbersThatAreWinningCount: number
    points: number

    constructor(rawGame: string) {
        const [rawCard, rawNumbers] = rawGame.split(": ")
        const [, id] = rawCard.split(" ").filter(s => s != '')
        this.id = +id
        const [winningNumbers, ownedNumbers] = rawNumbers.split(" | ")
        .map(r => {
            return r.split(" ").filter(n => n !== '').map(n => +n)
        })

        this.winningNumbers = winningNumbers
        this.ownedNumbers = ownedNumbers

        this.ownedNumbersThatAreWinningCount = ownedNumbers.filter(on => winningNumbers.some(wn => wn == on)).length
        this.points = this.ownedNumbersThatAreWinningCount > 0 ? 1 << this.ownedNumbersThatAreWinningCount - 1 : 0
    }
}

export function solve1(input: string): number {
    const games = input.split("\n").map(l => { return new Game(l)})
    return games.reduce((p,c) => p + c.points, 0)
}

export function solve2(input: string): number {
    const games = input.split("\n").map(l => { return new Game(l)})
    let gamesToCount: number[] = new Array(games.length).fill(0)
    let gamesToProcess = [...games]

    let totalCardCount = 0
    while (gamesToProcess.length > 0) {
        const game = gamesToProcess.pop()!

        const cardCount = gamesToCount[game.id - 1]
        if (cardCount > 0) {
            totalCardCount += cardCount
            continue
        }

        let thisCardCount = 1
        for (let i = game.id; i < game.id + game.ownedNumbersThatAreWinningCount; i++) {
            if (i < games.length) {
                thisCardCount += gamesToCount[i]
            } else {
                break
            }
        }
        
        gamesToCount[game.id -1] = thisCardCount
        totalCardCount += thisCardCount

    }
    
    return totalCardCount
}