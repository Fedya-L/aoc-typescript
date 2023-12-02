interface CubeSet {
    red: number
    green: number
    blue: number
}

class Game {
    readonly id: number
    readonly revelaledSets: CubeSet[]

    constructor(id: number, revealedSets: CubeSet[]) {
        this.id = id
        this.revelaledSets = revealedSets
    }

    canContainSet(referenceSet: CubeSet): boolean {
        for (const revelaledSet of this.revelaledSets) {
            if (!this.canSetBeContainedInSet(revelaledSet, referenceSet)) {
                return false
            }
        }
        return true
    }

    private canSetBeContainedInSet(set: CubeSet, referenceSet: CubeSet): boolean {
        return  set.red <= referenceSet.red &&
                set.green <= referenceSet.green &&
                set.blue <= referenceSet.blue
    }

    smallestSet(): CubeSet {
        let cubeSet: CubeSet = {red: 0, green: 0, blue: 0}
        const keys = Object.keys(cubeSet)
        
        for (const revelealedSet of this.revelaledSets) {
            for (const key of keys) {
                if (cubeSet[key] < revelealedSet[key]) {
                    cubeSet[key] = revelealedSet[key]
                }
            }
        }

        return cubeSet
    }
}


function parseSet(rawSet: string): CubeSet {
    let cubeSet: CubeSet = {red: 0, green: 0, blue: 0}
    for (const rawCubeColorCount of rawSet.split(', ')) {
        const [stringNumber, color] = rawCubeColorCount.split(' ')
        cubeSet[color] = +stringNumber
    }

    return cubeSet
}

function parseGame(rawGame: string): Game {
    const [game, rawSets] = rawGame.split(": ")
    const [, id] = game.split(" ")
    const sets = rawSets.split("; ").map(parseSet)


    return new Game(
        +id,
        sets
    )
}

export function solve1(input: string): number {
    const referenceSet: CubeSet = {
        red: 12,
        green: 13,
        blue: 14,
    }
    const games = input.split("\n").map(parseGame)
    return games.reduce((p, c) => {
        if (c.canContainSet(referenceSet)) {
            return p + c.id
        }
        return p
    }, 0)
}

export function solve2(input: string): number {
    return input.split("\n")
    .map((rawGame) => {
        const game = parseGame(rawGame)
        const smallestSet = game.smallestSet()
        return smallestSet.red * smallestSet.green * smallestSet.blue
    })
    .reduce((p, c) => p + c, 0)
}
