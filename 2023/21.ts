import { ConvenientArray2D, Coordinate2D } from "../utils/data-things"

type Tile = 'S' | '#' | '.'

type GardenMap = ConvenientArray2D<Tile>

function inputToGardenMap(i: string): GardenMap {
    const a = i.split("\n").map(l => l.split('')) as Tile[][]
    const ca = new ConvenientArray2D(a)
    return ca
}

function findStartingCoordinate(gm: GardenMap): Coordinate2D {
    for (const [x,y] of gm) {
        if (gm.get(x,y) === 'S') {
            return {x,y}
        }
    }
    throw 'Starting coordinate not found!'
}

function coordinateToKey(c: Coordinate2D): string {
    return `${c.x},${c.y}`
}

function addCoordinateToMap(c: Coordinate2D, m: Map<string, Coordinate2D>) {
    m.set(coordinateToKey(c), c)   
}

const neightbours: Coordinate2D[] = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}]
function findPossibleSteps(c: Coordinate2D, gm: GardenMap): Coordinate2D[] {
    let cs: Coordinate2D[] = []
    for (const n of neightbours) {
        const cc = {
            x: c.x + n.x,
            y: c.y + n.y,
        }
        if (gm.getXY(cc) === '.') {
            cs.push(cc)
        }
    }
    return cs
}

export function solve1(input: string, stepsCount: number): number {
    const gm = inputToGardenMap(input)
    const sc = findStartingCoordinate(gm)
    gm.setXY(sc, '.')
    
    let steps = new Map<string, Coordinate2D>()

    addCoordinateToMap(sc, steps)

    for (let i = 0; i < stepsCount; i++) {
        let nextSteps = new Map<string, Coordinate2D>()

        for (const s of steps.values()) {
            findPossibleSteps(s, gm).forEach(ps => addCoordinateToMap(ps, nextSteps))
        }

        steps = nextSteps
    }

    return steps.size
}

export function solve2(input: string): number {
    return -2
}