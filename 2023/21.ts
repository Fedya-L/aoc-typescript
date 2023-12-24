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

class CoordinateSet {
    data: Set<string>

    constructor(data: Set<string> | undefined = undefined) {
        this.data = data ?? new Set()
    }

    add(c: Coordinate2D) {
        this.data.add(this.coordinateToKey(c))
    }

    has(c: Coordinate2D) {
        return this.data.has(this.coordinateToKey(c))
    }

    coordinateToKey(c: Coordinate2D): string {
        return `${c.x},${c.y}`
    }

    copy(): CoordinateSet {
        return new CoordinateSet(new Set([...this.data]))
    }
}


export function solve1v2(i: string, stepsToDo: number): number {

    const gm = inputToGardenMap(i)
    const sc = findStartingCoordinate(gm)

    const visited = new CoordinateSet()
    const oddCoordinates = new CoordinateSet()
    const evenCoordinates = new CoordinateSet()


    let queue: {c: Coordinate2D, stepsLeft: number}[] = [{c: sc, stepsLeft: stepsToDo}]

    while (queue.length) {
        const {c, stepsLeft} = queue.shift()!
        if (visited.has(c)) continue
        visited.add(c)
        if (stepsLeft % 2 === 0) {
            evenCoordinates.add(c)
        } else {
            oddCoordinates.add(c) 
        }

        if (stepsLeft === 0) {
            continue
        }

        for (const {x, y} of neightbours) {
            const nx = c.x + x, ny = c.y + y
            const nc = {x: nx, y: ny}
            const tile = gm.getXY(nc)
            if (
                tile !== '.' ||
                visited.has(nc)
                ) {
                continue
            }
            queue.push({c: nc, stepsLeft: stepsLeft - 1})
        }
    }


    return stepsToDo % 2 === 0 ? evenCoordinates.data.size : oddCoordinates.data.size
}

export function fillMap(gm: GardenMap, sc: Coordinate2D, maxSteps: number): [number, number] {

    const visited = new CoordinateSet()
    const oddCoordinates = new CoordinateSet()
    const evenCoordinates = new CoordinateSet()


    let queue: {c: Coordinate2D, stepsDone: number}[] = [{c: sc, stepsDone: 0}]

    while (queue.length) {
        const {c, stepsDone} = queue.shift()!
        if (visited.has(c)) continue
        visited.add(c)
        if (stepsDone % 2 === 0) {
            evenCoordinates.add(c)
        } else {
            oddCoordinates.add(c) 
        }
        if (stepsDone >= maxSteps) {
            continue
        }

          for (const {x, y} of neightbours) {
            const nx = c.x + x, ny = c.y + y
            const nc = {x: nx, y: ny}
            const tile = gm.getXY(nc)
            if (
                tile !== '.' ||
                visited.has(nc)
                ) {
                continue
            }
            queue.push({c: nc, stepsDone: stepsDone + 1})
        }
    }


    return [evenCoordinates.data.size, oddCoordinates.data.size]
}

export function solve2(input: string, steps: number): number {
    const gardenMap = inputToGardenMap(input)
    const startingPoint = findStartingCoordinate(gardenMap)
    
    const gridWith = (steps - startingPoint.x) / gardenMap.xSize
    const evenCount = (gridWith + 1) ** 2
    const oddCount = (gridWith) ** 2


    const [evenCoordinates, oddCoordinates] = fillMap(gardenMap, startingPoint, gardenMap.xSize * 3)
    
    let result = evenCount * evenCoordinates + oddCount * oddCoordinates

    result += (gridWith + 1) * (evenCoordinates + oddCoordinates) * 2 


    return result
}