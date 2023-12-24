import { ConvenientArray2D, Coordinate2D } from "../utils/data-things"

type Tile = '#' | '.' | '>' | '<' | 'v' | '^'
type HikingMap = ConvenientArray2D<Tile>




function inputToHikingMap(i: string): HikingMap {
    return new ConvenientArray2D<Tile>(i.split("\n").map(l => l.split('') as Tile[]))
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

const possibleCoordinates: {[key: string]: [number, number][]} = {
    '#': [],
    '.': [
        [-1,0],
        [1, 0],
        [0,-1],
        [0,1],
    ],
    '>': [[1,0]],
    '<': [[-1,0]],
    'v': [[0,1]],
    '^': [[0,-1]],
}

function getNextCoordinates(c: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): Coordinate2D[] {
    const currentTile = hikingMap.getXY(c)!
    const ps = possibleCoordinates[currentTile].map(([x,y]) => ({x: c.x + x, y: c.y + y})).filter(c => !visitedCoordinates.has(c))
    if (ps.length === 0) {
        return []
    }

    let nextCoordinates: Coordinate2D[] = []
    for (const cc of ps) {
        const tile = hikingMap.getXY(cc) ?? '#'
        if (tile === '#') {
            continue
        }
        if (tile === '.') {
            nextCoordinates.push(cc)
            continue
        }
        if (tile === '>') {
            if (cc.x - c.x !== -1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === '<') {
            if (cc.x - c.x !== 1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === 'v') {
            if (cc.y - c.y !== -1) {
                nextCoordinates.push(cc)
            }
            continue
        }
        if (tile === '^') {
            if (cc.y - c.y !== 1) {
                nextCoordinates.push(cc)
            }
            continue
        }
    }

    return nextCoordinates
}

// Returns possible paths (lenghts)
function traversePath(currentPoint: Coordinate2D, finishPoint: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): number[] {
    if (currentPoint.x === finishPoint.x && currentPoint.y === finishPoint.y) {
        return [visitedCoordinates.data.size]
    }
    visitedCoordinates.add(currentPoint)
    const nextCoordinates = getNextCoordinates(currentPoint, hikingMap, visitedCoordinates)
    if (nextCoordinates.length === 0) {
        return []
    }
    if (nextCoordinates.length === 1) {
        return traversePath(nextCoordinates[0], finishPoint, hikingMap, visitedCoordinates)
    }

    return nextCoordinates.flatMap(c => traversePath(c, finishPoint, hikingMap, new CoordinateSet(new Set([...visitedCoordinates.data]))))
}

export function solve1(i: string): number {

    const hikingMap = inputToHikingMap(i)
    const startingPoint: Coordinate2D = {x: 1, y: 0}
    const finishPoint: Coordinate2D = {x: hikingMap.xSize - 2, y: hikingMap.ySize - 1}


    const possiblePaths = traversePath(startingPoint, finishPoint, hikingMap, new CoordinateSet())

    return possiblePaths.sort((a,b) => b - a)[0]
}

function getNextCoordinatesV2(c: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): Coordinate2D[] {
    const currentTile = hikingMap.getXY(c)!
    const ps = possibleCoordinates['.'].map(([x,y]) => ({x: c.x + x, y: c.y + y})).filter(c => !visitedCoordinates.has(c))
    if (ps.length === 0) {
        return []
    }

    let nextCoordinates: Coordinate2D[] = []
    for (const cc of ps) {
        const tile = hikingMap.getXY(cc) ?? '#'
        if (tile === '#') {
            continue
        }
        nextCoordinates.push(cc)
    }

    return nextCoordinates
}

// Returns possible paths (lenghts)
function traversePathV2(currentPoint: Coordinate2D, finishPoint: Coordinate2D, hikingMap: HikingMap, visitedCoordinates: CoordinateSet): number[] {
    if (currentPoint.x === finishPoint.x && currentPoint.y === finishPoint.y) {
        return [visitedCoordinates.data.size]
    }
    visitedCoordinates.add(currentPoint)
    const nextCoordinates = getNextCoordinatesV2(currentPoint, hikingMap, visitedCoordinates)
    if (nextCoordinates.length === 0) {
        return []
    }
    if (nextCoordinates.length === 1) {
        return traversePathV2(nextCoordinates[0], finishPoint, hikingMap, visitedCoordinates)
    }

    return nextCoordinates.flatMap(c => traversePathV2(c, finishPoint, hikingMap, visitedCoordinates.copy()))
}

export function solve2(i: string): number {
    const hikingMap = inputToHikingMap(i)
    const startingPoint: Coordinate2D = {x: 1, y: 0}
    const finishPoint: Coordinate2D = {x: hikingMap.xSize - 2, y: hikingMap.ySize - 1}


    const possiblePaths = traversePathV2(startingPoint, finishPoint, hikingMap, new CoordinateSet())

    return possiblePaths.sort((a,b) => b - a)[0]
}