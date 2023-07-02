const shapeToPoints = new Map<string, number>([
    ['A', 1],
    ['B', 2],
    ['C', 3],
    ['X', 1],
    ['Y', 2],
    ['Z', 3],
])
const shapeToWinTo = new Map<string, string>([
    ['A', 'Z'],
    ['B', 'X'],
    ['C', 'Y'],
])
function playRound(round: string): number {

    const shapes = round.split(' ')

    let result = 0

    if (shapeToPoints.get(shapes[0]) === shapeToPoints.get(shapes[1])) {
        // draw
        result = 3
    } else if (shapeToWinTo.get(shapes[0]) ===  shapes[1]) {
        result = 0
    }  else {
        result = 6
    }
    

    return (shapeToPoints.get(shapes[1]) ?? 0) + result
}

export function solve1(input: string): number {
    const rounds = input.split('\n')
    const results = rounds.map((round) => {
        return playRound(round)
    })
    return results.reduce((p, c) => (p + c))
}

const winToLose = {
    'A': 'C',
    'B': 'A',
    'C': 'B',
}

const loseToWin = {
    'A': 'B',
    'B': 'C',
    'C': 'A',
}

function sneakyPlayRound(round: string): number {
    const [ opponent, needTo ] = round.split(' ')

    let result = 0

    switch (needTo) {
        case 'X':
            result = 0 + shapeToPoints.get(winToLose[opponent]!)!
            break
        case 'Y':
            result = 3 + shapeToPoints.get(opponent)!
            break
        case 'Z':
            result = 6 + shapeToPoints.get(loseToWin[opponent]!)!
            break
    }

    return result
}


export function solve2(input: string): number {
    const rounds = input.split('\n')
    const results = rounds.map((round) => {
        return sneakyPlayRound(round)
    })
    return results.reduce((p, c) => (p + c))
}
